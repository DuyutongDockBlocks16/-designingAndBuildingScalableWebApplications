const { test, expect } = require("@playwright/test");

test("Index page has the title 'Dulto FitechlOl Courses'", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Dulto FitechlOl Courses");
});

test("Submit a incorrect assignment", async ({ page }) => {
  test.setTimeout(2000000);

  page.on('load', () => {
    console.log(`Page loaded: ${page.url()} at ${new Date().toISOString()}`);
  });

  await page.goto("/");
  await page.waitForSelector('#assignment',{timeout:20000});
  const code = "errorrrrrrrrrrrrrrrrrrrAndBuggggggggggggggggggs";
  // 获取 CodeMirror 的核心输入区域
  const editorContent = await page.waitForSelector(".cm-content[contenteditable='true']",{timeout:5000});
  
  // 单击以激活编辑器
  await editorContent.click();

  // 模拟键盘输入代码
  await page.keyboard.type(code);

  await page.waitForLoadState('networkidle');
  // 点击提交按钮
  const submitButton = page.locator("#submitbutton");
  await submitButton.waitFor();
  await submitButton.click({ force: true });
  const wasClicked = await submitButton.evaluate((btn) => {
    let clicked = false;
    btn.addEventListener("click", () => { clicked = true; });
    btn.click();
    return clicked;
  });
  console.log("Was the button clicked:", wasClicked);

  await page.waitForTimeout(5000);

  const pageContent = await page.content();
  console.log("Page HTML after clicking submit:", pageContent);

  await page.waitForSelector('#ingrading');
  await page.waitForSelector('#result', {timeout:2000000});
  await expect(page.locator("#correctness")).toHaveText("Not Passed...");
});

test("Submit a correct assignment", async ({ page }) => {
  test.setTimeout(2000000);

  await page.waitForTimeout(5000);

  page.on('load', () => {
    console.log(`Page loaded: ${page.url()} at ${new Date().toISOString()}`);
  });


  await page.goto("/");

  // const pageContent = await page.content();
  // console.log("Page HTML after clicking submit:", pageContent);

  await page.waitForSelector('#assignment', {timeout:20000});
  const code = "def hello_world(): return 'hello_world'";
  // 获取 CodeMirror 的核心输入区域
  const editorContent = await page.waitForSelector(".cm-content[contenteditable='true']",{timeout:5000});

  // 单击以激活编辑器
  await editorContent.click();

  // 模拟键盘输入代码
  await page.keyboard.type(code);

  // 获取输入后的编辑器内容
  const editorText = await editorContent.innerText();
  console.log("Editor content after input:", editorText);

  // 验证代码是否成功输入
  expect(editorText).toContain(code);

  await page.waitForLoadState('networkidle');

  // 获取提交按钮
  const submitButton = page.locator("#submitbutton");
  await submitButton.waitFor();

  page.on('console', (msg) => console.log(msg.text()));
  // 点击提交按钮
  await submitButton.click({ force: true });
  const wasClicked = await submitButton.evaluate((btn) => {
    let clicked = false;
    btn.addEventListener("click", () => { clicked = true; });
    btn.click();
    return clicked;
  });
  console.log("Was the button clicked:", wasClicked);

  // 检查按钮样式
  const buttonClass = await submitButton.getAttribute("class");
  console.log("Submit button class after click:", buttonClass);

  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(5000);

  const pageContent = await page.content();
  console.log("Page HTML after clicking submit:", pageContent);

  await page.waitForSelector('#ingrading'); // 根据类选择器查找

  await page.waitForSelector('#result', {timeout:200000});
  await expect(page.locator("#correctness")).toHaveText("Passed!");
});

test("Submit a correct assignment and fetch next assignment", async ({ page }) => {
  test.setTimeout(2000000);

  await page.waitForTimeout(5000);

  page.on('load', () => {
    console.log(`Page loaded: ${page.url()} at ${new Date().toISOString()}`);
  });


  await page.goto("/");

  // const pageContent = await page.content();
  // console.log("Page HTML after clicking submit:", pageContent);

  await page.waitForSelector('#assignment', {timeout:20000});
  const code = "def hello_world(): return 'hello_world'";
  // 获取 CodeMirror 的核心输入区域
  const editorContent = await page.waitForSelector(".cm-content[contenteditable='true']",{timeout:5000});

  // 单击以激活编辑器
  await editorContent.click();

  // 模拟键盘输入代码
  await page.keyboard.type(code);

  // 获取输入后的编辑器内容
  const editorText = await editorContent.innerText();
  console.log("Editor content after input:", editorText);

  // 验证代码是否成功输入
  expect(editorText).toContain(code);

  await page.waitForLoadState('networkidle');

  // 获取提交按钮
  const submitButton = page.locator("#submitbutton");
  await submitButton.waitFor();

  page.on('console', (msg) => console.log(msg.text()));
  // 点击提交按钮
  await submitButton.click({ force: true });
  const wasClicked = await submitButton.evaluate((btn) => {
    let clicked = false;
    btn.addEventListener("click", () => { clicked = true; });
    btn.click();
    return clicked;
  });
  console.log("Was the button clicked:", wasClicked);

  // 检查按钮样式
  const buttonClass = await submitButton.getAttribute("class");
  console.log("Submit button class after click:", buttonClass);

  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(5000);

  const pageContent = await page.content();
  console.log("Page HTML after clicking submit:", pageContent);

  await page.waitForSelector('#ingrading'); // 根据类选择器查找

  await page.waitForSelector('#result', {timeout:200000});
  await expect(page.locator("#correctness")).toHaveText("Passed!");
  await page.locator("#next").click();
  await expect(page.locator("#assignment")).toHaveText("Assignment #2: Hello Web Development Define a function named \"hello_world\" whose function is to return a string \"Hello Web Development\" 91› Submit for grading");
});
