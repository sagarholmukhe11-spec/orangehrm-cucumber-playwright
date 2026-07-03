# src/features/employee.feature
# Feature file for OrangeHRM Employee Management (PIM module)
# Covers: Add Employee, Search Employee

Feature: OrangeHRM Employee Management
  As an HR admin
  I want to manage employees in OrangeHRM
  So that I can maintain accurate employee records

  # Background runs before EVERY scenario in this file
  # Logs in as admin first — all employee scenarios need login
  Background:
    Given I am on the OrangeHRM login page
    When I enter username "Admin" and password "admin123"
    Then I should be redirected to the dashboard

  # ── SMOKE TESTS ──────────────────────────────────────────

  @smoke @employee
  Scenario: Add a new employee successfully
    When I navigate to the PIM module
    And I click Add Employee
    And I fill in first name "John" and last name "TestDoe"
    And I save the employee
    Then I should see a success message

   @smoke @employee
    Scenario: Search for an existing employee
    When I navigate to the PIM module
    And I click Add Employee
    And I fill in first name "SagarD" and last name "KhatvkarS"
    And I save the employee
    Then I should see a success message
    When I navigate to the PIM module
    And I search for employee "SagarD KhatvkarS"
    Then I should see "SagarD KhatvkarS" in the employee list

  # ── REGRESSION TESTS ─────────────────────────────────────

  @regression @employee
  Scenario: Search for non existing employee shows no records
    When I navigate to the PIM module
    And I search for employee "NonExistentXYZ999"
    Then I should see no records found

  @regression @employee
  Scenario: Add employee with only first name fails validation
    When I navigate to the PIM module
    And I click Add Employee
    And I fill in first name "John" and last name ""
    And I save the employee
    Then I should see required field error