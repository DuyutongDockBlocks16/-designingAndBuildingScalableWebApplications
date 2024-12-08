import os
import json
import aio_pika
import asyncio
from dotenv import load_dotenv
import asyncpg
import functools
import uuid
import unittest
import sys
import shutil
import glob
from pathlib import Path

# 加载 .env 文件
load_dotenv("project.env")

# 从环境变量中读取 RabbitMQ 连接信息
mq_host = "mq"
mq_port = 5672
mq_user = os.getenv("RABBITMQ_DEFAULT_USER", "guest")
mq_password = os.getenv("RABBITMQ_DEFAULT_PASS", "guest")

pg_host = "database-server"
pg_port = 5432
pg_user = os.getenv("POSTGRES_USER", "username") 
pg_password = os.getenv("POSTGRES_PASSWORD", "password") 
pg_database = os.getenv("POSTGRES_DB", "database") 

is_reachable = False
max_try = 6
random_uuid = uuid.uuid4()
folder_name = "codefolder" + str(random_uuid)

async def create_pool():
    return await asyncpg.create_pool(
        host = pg_host,
        port = pg_port,
        user = pg_user,
        password = pg_password,
        database = pg_database,
        min_size=5,  # 设置连接池的最小连接数
        max_size=10  # 设置连接池的最大连接数
    )

async def query_database(pool, query, *params):
    async with pool.acquire() as connection:
        result = await connection.fetch(query, *params)
        return result

async def grader(code, assignment_id,pool):
# 查询数据库操作
    get_test_code_query = "SELECT test_code FROM public.programming_assignments WHERE id = $1"
    get_test_code_query_result = await query_database(pool, get_test_code_query, assignment_id)
    
    # 假设结果只返回一行
    if get_test_code_query_result:
        test_code = get_test_code_query_result[0]['test_code']  # 获取查询结果的 test_code
        print(f"Test code: {test_code}")

    current_dir = Path.cwd()
    # 查找所有包含'codefolder'字样的文件夹
    for folder_path in glob.glob(str(current_dir / folder_name)):
        folder = Path(folder_path)
        if folder.is_dir():
            shutil.rmtree(folder)
            print(f"已删除文件夹及其内容：{folder}")

    folder_path = Path(folder_name)
    folder_path.mkdir(parents=True, exist_ok=True)

    code_filename = f'python_code.py'
    test_code_filename = f'test_code.py'

    # 构建文件的完整路径
    code_filepath = folder_path / code_filename
    test_code_filepath = folder_path / test_code_filename

    with open(code_filepath, 'w') as f:
        f.write(code)

    with open(test_code_filepath, 'w') as f:
        f.write(test_code)
    
    # 将 test_code.py 所在的目录添加到 sys.path 中
    sys.path.append(str(test_code_filepath.parent))

    # 获取模块名（去掉扩展名）
    test_module_name = test_code_filepath.stem

    # 如果模块已经在 sys.modules 中，移除它
    if test_module_name in sys.modules:
        sys.modules.pop(test_module_name)
    
    # 步骤2: 通过 unittest 运行 test_code.py 中的测试
    try:
        result = unittest.TextTestRunner().run(unittest.defaultTestLoader.loadTestsFromName(test_module_name))
        if result.wasSuccessful():
            grading_result = True
            grader_feedback = "Test passed successfully."
        else:
            grading_result = False
            grader_feedback = "Test failed."
            # 打印失败的测试信息
            for failure in result.failures:
                grader_feedback = grader_feedback + f"\nFailure in {failure[0]}: {failure[1]}"
            # 或者打印错误信息
            for error in result.errors:
                grader_feedback = grader_feedback + f"\nError in {error[0]}: {error[1]}" # error[0] 是测试方法名，error[1] 是异常信息
    except:
        grading_result = False
        grader_feedback = "Test failed."


    

    return grading_result, grader_feedback

# 定义消息处理的回调函数
async def on_message(message: aio_pika.IncomingMessage, pool):
    async with message.process():
        json_data = json.loads(message.body)
        print("Message received:", json_data)

        code = json_data.get("code")
        assignment_id = json_data.get("assignmentId")
        submission_id = json_data.get("submissionId")

        # 执行评分操作
        # print(f"code: {code}")
        grading_result, grader_feedback = await grader(code, assignment_id, pool)

        print(f"grading_result: {grading_result}")
        print(f"grader_feedback: {grader_feedback}")

        # # 更新提交结果
        try:
            await update_submission(grading_result, grader_feedback, submission_id, pool)
            print("Update submission successfully")
        except Exception as e:
            print(f"Error updating submission: {e}")

# 假设的 update_submission 服务
async def update_submission(grading_result, grader_feedback, submission_id, pool):
    async with pool.acquire() as connection:

        if grading_result is True:
            update_sql = """
                UPDATE programming_assignment_submissions
                SET status = 'processed', grader_feedback = $2, correct = true
                WHERE id = $1
            """
            
        
        else:
            # 如果是 False，可以执行不同的 SQL 操作（例如更新或插入）
            update_sql = """
                UPDATE programming_assignment_submissions
                SET status = 'processed', grader_feedback = $2
                WHERE id = $1
            """
        
        await connection.execute(update_sql, submission_id, grader_feedback)

# 消费消息的异步函数
async def consume_messages():
    for attempt in range(max_try):
        try:
            connection = await aio_pika.connect_robust(
                host=mq_host,
                port=mq_port,
                login=mq_user,
                password=mq_password
            )
            print("Connected to RabbitMQ!")
            break
        except aio_pika.exceptions.AMQPConnectionError as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_try - 1:
                print("Retrying in 5 seconds...")
                await asyncio.sleep(5)  # 使用异步睡眠避免阻塞
            else:
                print("Failed to connect to RabbitMQ after maximum retries.")
                return  # 无法连接时直接返回
    
    pool = await create_pool()

    # 检查连接状态
    async with connection:
        channel = await connection.channel()
        queue_name = "submission_queue"
        queue = await channel.declare_queue(queue_name)
        print(f"Listening to the queue '{queue_name}'...")

        await queue.consume(functools.partial(on_message, pool=pool))  # 异步消费消息
        await asyncio.Future()  # 保持连接不关闭

# 启动消息消费
if __name__ == "__main__":
    current_dir = Path.cwd()

    # 查找所有包含'codefolder'字样的文件夹
    for folder_path in glob.glob(str(current_dir / "codefolder*")):
        folder = Path(folder_path)
        if folder.is_dir():
            shutil.rmtree(folder)
            print(f"已删除文件夹及其内容：{folder}")

    asyncio.run(consume_messages())
