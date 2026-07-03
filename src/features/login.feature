# src/features/login.feature
# Feature file for OrangeHRM Login module
# Written in plain English — anyone can read and understand
# Tags like @smoke and @regression help run specific tests

Feature: OrangeHRM Login Functionality
  As a user
  I want to login to OrangeHRM
  So that I can access the HR system

  Background:
    Given I am on the OrangeHRM login page

  # ── SMOKE TESTS ──────────────────────────────────────────

  @smoke @login
  Scenario: Valid admin login navigates to dashboard
    When I enter username "Admin" and password "admin123"
    Then I should be redirected to the dashboard

  @smoke @login
  Scenario: Successful logout returns to login page
    When I enter username "Admin" and password "admin123"
    Then I should be redirected to the dashboard
    When I click logout
    Then I should be on the login page

  # ── REGRESSION TESTS ─────────────────────────────────────

  # Uses "I should see login error" → checks the BANNER message
  @regression @login
  Scenario: Invalid credentials show error message
    When I enter username "wronguser" and password "wrongpass"
    Then I should see login error "Invalid credentials"

  # CHANGED — now uses "I should see required field error"
  # → checks the INLINE red text under the empty field, not the banner
  @regression @login
  Scenario: Empty username shows required error
    When I enter username "" and password "admin123"
    Then I should see required field error

  # CHANGED — same reason as above
  @regression @login
  Scenario: Empty password shows required error
    When I enter username "Admin" and password ""
    Then I should see required field error