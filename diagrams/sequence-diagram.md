# Sequence Diagrams - Restaurant Reservation System

## Overview
This document contains sequence diagrams for the main workflows in the Restaurant Reservation System.

---

## 1. User Registration Flow

```plantuml
@startuml
actor User
participant "RegisterPage" as RP
participant "RegisterHandler\n(/api/register)" as RH
participant "PrismaClient" as PC
participant "bcrypt" as BC
database "PostgreSQL" as DB

User -> RP: Fill registration form\n(name, email, phone, password)
User -> RP: Click "Register"
RP -> RP: Validate form data
RP -> RH: POST /api/register\n{name, email, telephone, password}
RH -> RH: Validate required fields
RH -> PC: findUnique({email})
PC -> DB: SELECT * FROM User\nWHERE email = ?
DB --> PC: null (no existing user)
PC --> RH: null
RH -> BC: hash(password, 10)
BC --> RH: hashedPassword
RH -> PC: create({name, email,\ntelephone, hashedPassword})
PC -> DB: INSERT INTO User\nVALUES (...)
DB --> PC: User record
PC --> RH: User{id, name, email,\ntelephone, role: USER}
RH --> RP: 201 Created\n{message, user}
RP -> RP: Show success message
RP --> User: Redirect to login page

@enduml
```

---

## 2. User Login Flow

```plantuml
@startuml
actor User
participant "LoginPage" as LP
participant "NextAuth" as NA
participant "AuthOptions" as AO
participant "PrismaClient" as PC
participant "bcrypt" as BC
database "PostgreSQL" as DB

User -> LP: Enter email & password
User -> LP: Click "Sign In"
LP -> NA: signIn('credentials',\n{email, password})
NA -> AO: authorize(credentials)
AO -> AO: Validate credentials exist
AO -> PC: findUnique({email})
PC -> DB: SELECT * FROM User\nWHERE email = ?
DB --> PC: User record
PC --> AO: User{id, email,\npassword(hashed), role}
AO -> BC: compare(password,\nhashedPassword)
BC --> AO: true
AO --> NA: User{id, email, name, role}
NA -> NA: Create JWT token\nwith role & id
NA -> NA: Create session
NA --> LP: Success
LP --> User: Redirect to /dashboard

note right of NA
JWT callback adds:
- token.role = user.role
- token.id = user.id

Session callback adds:
- session.user.role
- session.user.id
end note

@enduml
```

---

## 3. Make Reservation Flow (User)

```plantuml
@startuml
actor User
participant "RestaurantPage" as RSP
participant "ReservationForm" as RF
participant "ReservationHandler\n(/api/reservations)" as RH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

User -> RSP: Navigate to restaurant details
RSP -> PC: GET /api/restaurants/{id}
PC -> DB: SELECT * FROM Restaurant\nWHERE id = ?
DB --> PC: Restaurant record
PC --> RSP: Restaurant data
RSP --> User: Display restaurant info\nand reservation form

User -> RF: Select date & time
User -> RF: Click "Reserve"
RF -> RF: Validate form
RF -> RH: POST /api/reservations\n{date, restaurantId}

RH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RH: Session{user{id, role}}

RH -> RH: Validate required fields

RH -> PC: count({userId})
PC -> DB: SELECT COUNT(*)\nFROM Reservation\nWHERE userId = ?
DB --> PC: count = 2
PC --> RH: 2 reservations
RH -> RH: Check limit (2 < 3) ✓

RH -> PC: findUnique({restaurantId})
PC -> DB: SELECT * FROM Restaurant\nWHERE id = ?
DB --> PC: Restaurant{openTime,\ncloseTime}
PC --> RH: Restaurant data

RH -> RH: Parse openTime (09:00)\nand closeTime (22:00)
RH -> RH: Validate reservation time\n(19:30) within hours ✓

RH -> PC: create({date, userId,\nrestaurantId})
PC -> DB: INSERT INTO Reservation\nVALUES (...)
DB --> PC: Reservation record
PC --> RH: Reservation with Restaurant

RH --> RF: 201 Created\n{success: true, data}
RF --> User: Show success message\n"Reservation confirmed!"

@enduml
```

---

## 4. View User Reservations Flow

```plantuml
@startuml
actor User
participant "DashboardPage" as DP
participant "ReservationHandler\n(/api/reservations)" as RH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

User -> DP: Navigate to /dashboard
DP -> RH: GET /api/reservations

RH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RH: Session{user{id, role: USER}}

RH -> RH: isAdmin = false\nuserId from session

RH -> PC: findMany({\nwhere: {userId},\ninclude: {restaurant}\n})
PC -> DB: SELECT r.*, rest.*\nFROM Reservation r\nJOIN Restaurant rest\nON r.restaurantId = rest.id\nWHERE r.userId = ?
DB --> PC: Reservation[] with\nRestaurant data
PC --> RH: User's reservations

RH --> DP: 200 OK\n{success: true, data: reservations}
DP -> DP: Render reservations list
DP --> User: Display reservations with\nrestaurant details

@enduml
```

---

## 5. Cancel Reservation Flow

```plantuml
@startuml
actor User
participant "DashboardPage" as DP
participant "ReservationByIdHandler\n(/api/reservations/[id])" as RBH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

User -> DP: Click "Cancel" on\nreservation
DP -> DP: Confirm cancellation
User -> DP: Confirm

DP -> RBH: DELETE /api/reservations/{id}

RBH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RBH: Session{user{id, role: USER}}

RBH -> PC: findUnique({id})
PC -> DB: SELECT * FROM Reservation\nWHERE id = ?
DB --> PC: Reservation{userId, ...}
PC --> RBH: Existing reservation

RBH -> RBH: Check ownership\n(reservation.userId === session.user.id) ✓

RBH -> PC: delete({id})
PC -> DB: DELETE FROM Reservation\nWHERE id = ?
DB --> PC: Success
PC --> RBH: Deleted

RBH --> DP: 200 OK\n{success: true,\nmessage: "Reservation deleted"}
DP -> DP: Remove from UI
DP --> User: Show success message

@enduml
```

---

## 6. Admin Create Restaurant Flow

```plantuml
@startuml
actor Admin
participant "AdminPage" as AP
participant "RestaurantHandler\n(/api/restaurants)" as RH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

Admin -> AP: Navigate to /admin
MW -> MW: Check route protection\n/admin/* requires ADMIN role
MW --> AP: Authorized

Admin -> AP: Fill restaurant form\n(name, address, phone,\nopenTime, closeTime)
Admin -> AP: Click "Create Restaurant"

AP -> RH: POST /api/restaurants\n{name, address, telephone,\nopenTime, closeTime}

RH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RH: Session{user{role: ADMIN}}

RH -> RH: Verify role === ADMIN ✓

RH -> RH: Validate required fields

RH -> PC: create({name, address,\ntelephone, openTime, closeTime})
PC -> DB: INSERT INTO Restaurant\nVALUES (...)
DB --> PC: Restaurant record
PC --> RH: Restaurant data

RH --> AP: 201 Created\n{success: true, data}
AP -> AP: Refresh restaurant list
AP --> Admin: Show success message\n"Restaurant created!"

@enduml
```

---

## 7. Admin View All Reservations Flow

```plantuml
@startuml
actor Admin
participant "AdminPage" as AP
participant "ReservationHandler\n(/api/reservations)" as RH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

Admin -> AP: Navigate to /admin\nreservations tab
AP -> RH: GET /api/reservations

RH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RH: Session{user{id, role: ADMIN}}

RH -> RH: isAdmin = true\nno userId filter

RH -> PC: findMany({\ninclude: {restaurant, user},\norderBy: {date: 'asc'}\n})
PC -> DB: SELECT r.*, rest.*, u.*\nFROM Reservation r\nJOIN Restaurant rest\nON r.restaurantId = rest.id\nJOIN User u\nON r.userId = u.id\nORDER BY r.date ASC
DB --> PC: All reservations with\nRestaurant and User data
PC --> RH: Complete reservation list

RH --> AP: 200 OK\n{success: true, data: reservations}
AP -> AP: Render all reservations\nwith user and restaurant info
AP --> Admin: Display comprehensive\nreservation list

note right of AP
Admin can see:
- All user names & contacts
- All restaurants
- All reservation dates
- Can edit/delete any reservation
end note

@enduml
```

---

## 8. Update Restaurant Flow (Admin)

```plantuml
@startuml
actor Admin
participant "AdminPage" as AP
participant "RestaurantByIdHandler\n(/api/restaurants/[id])" as RBH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

Admin -> AP: Click "Edit" on restaurant
AP --> Admin: Show edit form with\ncurrent data
Admin -> AP: Modify fields\n(name, address, hours)
Admin -> AP: Click "Update"

AP -> RBH: PUT /api/restaurants/{id}\n{name, address, telephone,\nopenTime, closeTime}

RBH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RBH: Session{user{role: ADMIN}}

RBH -> RBH: Verify role === ADMIN ✓

RBH -> PC: update({\nwhere: {id},\ndata: {...updatedFields}\n})
PC -> DB: UPDATE Restaurant\nSET name = ?, address = ?, ...\nWHERE id = ?
DB --> PC: Updated Restaurant record
PC --> RBH: Restaurant data

RBH --> AP: 200 OK\n{success: true, data}
AP -> AP: Update UI with new data
AP --> Admin: Show success message\n"Restaurant updated!"

@enduml
```

---

## 9. Delete Restaurant Flow (Admin with Cascade)

```plantuml
@startuml
actor Admin
participant "AdminPage" as AP
participant "RestaurantByIdHandler\n(/api/restaurants/[id])" as RBH
participant "Middleware" as MW
participant "PrismaClient" as PC
database "PostgreSQL" as DB

Admin -> AP: Click "Delete" on restaurant
AP --> Admin: Show confirmation dialog\n"This will delete all\nassociated reservations"
Admin -> AP: Confirm deletion

AP -> RBH: DELETE /api/restaurants/{id}

RBH -> MW: Check authentication
MW -> MW: Verify JWT token
MW --> RBH: Session{user{role: ADMIN}}

RBH -> RBH: Verify role === ADMIN ✓

RBH -> PC: delete({id})
PC -> DB: DELETE FROM Reservation\nWHERE restaurantId = ?\n(CASCADE)
DB --> PC: Reservations deleted
PC -> DB: DELETE FROM Restaurant\nWHERE id = ?
DB --> PC: Restaurant deleted
PC --> RBH: Success

RBH --> AP: 200 OK\n{success: true,\nmessage: "Restaurant deleted"}
AP -> AP: Remove from UI
AP --> Admin: Show success message

note right of DB
Cascade deletion defined
in Prisma schema:
onDelete: Cascade
end note

@enduml
```

---

## 10. Middleware Authentication & Authorization Flow

```plantuml
@startuml
actor User
participant "Browser" as BR
participant "Middleware" as MW
participant "NextAuth" as NA
participant "Protected Route" as PR

User -> BR: Navigate to /dashboard\nor /admin/*
BR -> MW: HTTP Request
MW -> MW: Check route matcher\n(/dashboard/*, /admin/*)
MW -> NA: withAuth wrapper
NA -> NA: Extract JWT token\nfrom request
alt Token exists
    NA -> NA: Verify token signature
    NA -> NA: Decode token\n{id, role, email}
    NA --> MW: token data
    MW -> MW: Check if admin route\n(starts with /admin)
    alt Admin route AND role !== ADMIN
        MW -> MW: Unauthorized for admin area
        MW --> BR: Redirect to /dashboard
        BR --> User: Navigate to dashboard
    else Authorized
        MW --> PR: Continue to route
        PR --> BR: Page content
        BR --> User: Display page
    end
else Token missing/invalid
    NA --> MW: Unauthorized callback
    MW --> BR: Redirect to /login
    BR --> User: Navigate to login
end

note right of MW
Middleware config:
matcher: [
  "/dashboard/:path*",
  "/admin/:path*"
]
end note

@enduml
```

---

## 11. Error Handling - Reservation Limit Exceeded

```plantuml
@startuml
actor User
participant "ReservationForm" as RF
participant "ReservationHandler\n(/api/reservations)" as RH
participant "PrismaClient" as PC
database "PostgreSQL" as DB

User -> RF: Submit reservation form
RF -> RH: POST /api/reservations\n{date, restaurantId}

RH -> RH: Authenticate user ✓

RH -> PC: count({userId})
PC -> DB: SELECT COUNT(*)\nFROM Reservation\nWHERE userId = ?
DB --> PC: count = 3
PC --> RH: 3 reservations

RH -> RH: Check limit (3 >= 3) ✗
RH --> RF: 400 Bad Request\n{error: "Maximum 3 reservations\nallowed per user"}
RF --> User: Display error message\n"You have reached the\nmaximum reservation limit"

note right of User
User must cancel an
existing reservation
before making a new one
end note

@enduml
```

---

## 12. Error Handling - Outside Operating Hours

```plantuml
@startuml
actor User
participant "ReservationForm" as RF
participant "ReservationHandler\n(/api/reservations)" as RH
participant "PrismaClient" as PC
database "PostgreSQL" as DB

User -> RF: Select date/time\n(23:00 - 11:00 PM)
User -> RF: Submit reservation

RF -> RH: POST /api/reservations\n{date: "2024-01-15T23:00:00",\nrestaurantId}

RH -> RH: Authenticate user ✓
RH -> RH: Check reservation limit ✓

RH -> PC: findUnique({restaurantId})
PC -> DB: SELECT * FROM Restaurant\nWHERE id = ?
DB --> PC: Restaurant{openTime: "09:00",\ncloseTime: "22:00"}
PC --> RH: Restaurant data

RH -> RH: Parse times:\nopenMinutes = 540 (9:00 AM)\ncloseMinutes = 1320 (10:00 PM)
RH -> RH: Parse reservation time:\nresMinutes = 1380 (11:00 PM)
RH -> RH: Check: 540 <= 1380 < 1320 ✗

RH --> RF: 400 Bad Request\n{error: "Restaurant operating\nhours are between 09:00\nand 22:00"}
RF --> User: Display error message\n"Selected time is outside\nrestaurant operating hours"

@enduml
```

---

## Key Observations

### Authentication & Authorization Layers
1. **Middleware**: Route-level protection (checks if authenticated)
2. **API Handlers**: Operation-level authorization (checks roles and ownership)
3. **JWT Tokens**: Carry user id and role information

### Business Rules Enforcement
1. **3-Reservation Limit**: Enforced in POST /api/reservations
2. **Operating Hours**: Validated before reservation creation
3. **Ownership**: Users can only modify their own reservations
4. **Admin Privileges**: Admins bypass ownership checks and access all data

### Database Operations
1. **Cascade Deletes**: Configured in Prisma schema (onDelete: Cascade)
2. **Transactions**: Implicit in Prisma operations
3. **Indexes**: On userId and restaurantId for performance

### Error Handling
1. **400 Bad Request**: Validation errors, business rule violations
2. **401 Unauthorized**: Missing or invalid authentication
3. **403 Forbidden**: Insufficient permissions
4. **404 Not Found**: Resource doesn't exist
5. **500 Internal Server Error**: Unexpected errors

### Security Measures
1. **Password Hashing**: bcrypt with 10 rounds
2. **JWT Tokens**: Secure session management
3. **Role-Based Access Control**: USER vs ADMIN roles
4. **Input Validation**: All API endpoints validate input
5. **SQL Injection Protection**: Prisma parameterized queries