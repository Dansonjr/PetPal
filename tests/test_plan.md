# PetPal Test Plan

## 1. Authentication Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-01: Register new user | Fill name, email, password → Submit | Success message, redirect to dashboard | ⬜ |
| TC-02: Register with existing email | Use existing email | Error: "Email already registered" | ⬜ |
| TC-03: Login with valid credentials | Enter email/password | Redirect to dashboard | ⬜ |
| TC-04: Login with invalid password | Wrong password | Error: "Invalid credentials" | ⬜ |
| TC-05: Login with non-existent email | Unknown email | Error: "Invalid credentials" | ⬜ |
| TC-06: Logout | Click logout button | Redirect to login page, token cleared | ⬜ |
| TC-07: Protected route without token | Try to access /dashboard directly | Redirect to login | ⬜ |

## 2. Profile Management Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-08: View profile | Go to Profile tab | Display current user info | ⬜ |
| TC-09: Edit name | Change name → Save | Profile updated, success message | ⬜ |
| TC-10: Edit bio | Add bio → Save | Bio saved correctly | ⬜ |
| TC-11: Edit location | Add location → Save | Location saved correctly | ⬜ |
| TC-12: Empty fields | Leave fields empty | COALESCE keeps existing values | ⬜ |

## 3. Pet Management Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-13: Add pet | Fill name, species, breed, age → Add | Pet appears in list | ⬜ |
| TC-14: Add pet without name | Missing name → Submit | Error: "Pet name is required" | ⬜ |
| TC-15: Edit pet | Click Edit → Update → Save | Pet info updated | ⬜ |
| TC-16: Delete pet | Click Delete → Confirm | Pet removed from list | ⬜ |
| TC-17: View pets | Go to My Pets tab | Grid of pets displayed | ⬜ |

## 4. Friends System Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-18: Search for user | Type name in search → Search | User appears in results | ⬜ |
| TC-19: Send friend request | Click "Add Friend" | Success message, request sent | ⬜ |
| TC-20: View pending requests | Go to Requests tab | Incoming request appears | ⬜ |
| TC-21: Accept request | Click Accept | User added to friends list | ⬜ |
| TC-22: Reject request | Click Reject | Request disappears | ⬜ |
| TC-23: Duplicate request | Send to same user again | Error: "Request already exists" | ⬜ |

## 5. Chat System Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-24: Select chat | Click friend in chat list | Chat window opens | ⬜ |
| TC-25: Send message | Type message → Send | Message appears in chat | ⬜ |
| TC-26: Receive message (two browsers) | Send from Alice to Bob | Bob sees message instantly | ⬜ |
| TC-27: Typing indicator | Type in input field | "Friend is typing..." appears | ⬜ |
| TC-28: Read receipt | Bob views message | Message shows as read | ⬜ |
| TC-29: Message history | Close and reopen chat | Previous messages load | ⬜ |

## 6. Pet Matching Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-30: Browse nearby pets | Go to Pet Matches tab | See other users' pets | ⬜ |
| TC-31: Send match request | Click "Request Play Date" | Success message | ⬜ |
| TC-32: View incoming requests | Go to Requests tab | Pending request appears | ⬜ |
| TC-33: Accept match request | Click Accept | Status changes to accepted | ⬜ |
| TC-34: No pet message | User without pets visits matches | Link to add pet page | ⬜ |

## 7. UI/UX Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-35: Dark mode | Click moon/sun icon | Theme toggles, persists | ⬜ |
| TC-36: Mobile responsive | Resize browser to 375px | Layout adapts properly | ⬜ |
| TC-37: Loading states | Slow network | Spinners appear | ⬜ |
| TC-38: Error handling | Disconnect backend | User-friendly error message | ⬜ |

## 8. Performance Testing

| Test Case | Metric | Acceptable Range | Status |
|-----------|--------|------------------|--------|
| TC-39: Page load time | First paint | < 2 seconds | ⬜ |
| TC-40: API response time | Login endpoint | < 500ms | ⬜ |
| TC-41: Chat message delivery | Socket.io | < 200ms | ⬜ |

## 9. Security Testing

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| TC-42: Token storage | After login | Token in localStorage | ⬜ |
| TC-43: Token expiration | After 7 days | Redirect to login | ⬜ |
| TC-44: XSS prevention | Try <script> in input | Sanitized/escaped | ⬜ |
