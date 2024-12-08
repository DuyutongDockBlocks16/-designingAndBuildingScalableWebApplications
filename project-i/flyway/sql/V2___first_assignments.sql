INSERT INTO programming_assignments (title, assignment_order, handout, test_code) VALUES ('Your first program!', 1, 'Define a function named "hello_world" whose function is to return a string "hello_world"', 
'
import unittest
import importlib
import python_code

class TestHelloWorld(unittest.TestCase):
  def setUp(self):
    importlib.reload(python_code)

  def test_hello_world(self):
    self.assertEqual(python_code.hello_world(), "hello_world", "Function should return \"hello_world\"")
');

INSERT INTO programming_assignments (title, assignment_order, handout, test_code) VALUES ('Hello Web Development', 2, 'Define a function named "hello_world" whose function is to return a string "Hello Web Development"', 
'
import unittest
import importlib
import python_code

class TestHelloWorld(unittest.TestCase):
  def setUp(self):
    importlib.reload(python_code)

  def test_hello_world(self):
    self.assertEqual(python_code.hello_world(), "Hello Web Development", "Function should return \"Hello Web Development\"")
');

INSERT INTO programming_assignments (title, assignment_order, handout, test_code) VALUES ('Let computer do computing!', 3, 'Define a function named "sum" that takes two numbers as parameters and returns their sum.', 
'
import unittest
import importlib
import python_code

class TestSum(unittest.TestCase):
  def setUp(self):
    importlib.reload(python_code)

  def test_sum_1(self):
    self.assertEqual(python_code.sum(1, 2), 3, "The sum of 1 and 2 should be 3.")

  def test_sum_2(self):
    self.assertEqual(python_code.sum(97, 3), 100, "The sum of 97 and 3 should be 100.")
');