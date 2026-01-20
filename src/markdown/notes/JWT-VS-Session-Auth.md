---
title: JWT vs Session Authentication
description: How does JWT work compared to Session Authentication? And a rough guide on session auth implementation.
date: '2025-07-10'
categories:
    - Authentication
    - Security
published: true
---

## Session authentication

- Server stores session data in db
- Client receives guid (session id) and is stored with an expiration date
- Server verifies session is valid on each request (lookup if session's exp date hasn't happened)
- If the exp date of guid has passed, or a field in the db like `expired` is true, then request is denied.

**Pros**:

- Makes session invalidation easy, set the exp date in db then guid won't be valid on future requests
- All current past sessions are visible, easy to audit
- Expired sessions can be purged from DB

**Cons**:

- All requests require db lookup
- Sessions use up storage in the db

### Implementation Details

Create a table for credentials (`user_id`, `email`, `salt`, `hash`) and another for sessions (`FK_user_id`, `session_id` - uuid, `iat` - issued at, `exp` - exp date). Use a `hooks.server.ts` file to enforce users to log in before accessing routes.

1. On the client side during registration, a salt is randomly generated and is used to hash the password, then it is sent to the server.
2. The server receives the email, salt, and hash after registration and stores them in the credentials table.
3. When logging in, the user enters the email/username and the password, and the corresponding salt is sent to the client (the password is _not_ sent).
4. The client produces a hash using the password and the salt, then it is sent to the server.
5. The server compares the hashes and returns an error if they don't match or...
6. If valid, a session record is created in the sessions table with an expiration date N hours from the issued time.
7. The session id is sent to the client and stored in a cookie.
8. The client is redirected to the main app, and during every request the session id is checked.
    - Optional: Some user information is sent back to the client and stored in `events.local.user` (Svelte) so that it is available throughout the app.
9. To logout, the cookie is cleared, the session's `exp` value is set to the current time, and the user is redirected.

## JWT (JSON Web Tokens)

### Overview

JWTs are made of 3 parts, the header, the payload (claims set or another JWT if nesting), and the signature. Each part is a JSON object with no leading or trailing whitespace (ex: `{"alg":"HS256"}`), and base64url encoded and concatenated using a period.

```
<base64url encoded header>.<base64url encoded payload>.<base64url encoded signature>
```

**Process**:

- Server creates a signed token with user info
- Client stores token securely
- Server validates token on each request (no DB lookup needed)
- If token fails validation, or exp date (contained inside token) is invalid, request is denied.

**Pros**:

- No db storage needed
- All required info is self-contained (user, exp date, etc.)

**Cons**:

- Can't revoke, valid until expiration, would need to store "blacklisted" tokens in a db
- Must be stored securely on client, else can be reused past expiration
- Need to implement refresh token strategy

### Header

The header describes the cryptographic operations applied to the JWT claims set, the field that describes the JWT is `typ`, it can be `JWS` (JSON Web Signature) or `JWE` (JSON Web Encryption).
If `typ` is `JWS`, the JWT is represented as JWS and the claims are digitally signed or MACed.
If `typ` is `JWE`, the JWT is represented as JWE and the claims are encrypted and set as the payload.

JWT allows for nesting, so you can perform both, nesting and signing.

### Claims

A JWT claims set is a JSON object, the keys are called "claim names" and the values are "claim values". There are no mandatory claim names, you can name them whatever you desire, as long as they are unique and suit your application.
However, there are 3 categories of claim names:

- **Registered**: Established by IANA, and are a useful starting point when naming your claims.
    - `iss` (Issuer) - Who/what issued and signed the JWT (the source of the JWT)
    - `sub` (Subject) - Who/what is associated with the JWT (who is using it, or what does it represent)
    - `aud` (Audience) - Who/what is intended to use/process the JWT
    - `exp` (Expiration Time) - The time after which the JWT is no longer considered valid.
    - `nbf` (Not Before) - The JWT should not be processed before this time
    - `iat` (Issued At) - The time at which the JWT was issued (can help determine the life of the JWT)
    - `jti` (JWT ID) - A unique ID for the JWT, could be used to prevent the JWT from being replayed.
- **Public**: Not registered, but used by a lot of people and should be registered in the IANA "JSON Web Token Claims" to prevent collisions, or use a collision-resistant name.
- **Private**: Names that are not registered or public claim names, and may be subject to collision.

### Signature

The signature is created by taking the base64url encoded header and payload, concatenating them with a period, and signing the result using the specified algorithm in the header (e.g., HMAC SHA256, RSA, etc.). The signature ensures that the JWT has not been tampered with.

Suppose the header is:

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

And the payload is:

```json
{
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true,
    "iat": 1516239022
}
```

Base64url encoding the header and payload, and concatenating with a period gives (the line breaks are for readability):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRy
dWUsImlhdCI6MTUxNjIzOTAyMn0
```

The sigature is then created by signing that concatenated string with the algorithm specified in the header (in this case, HMAC SHA256) and a secret. Then the signature is appended:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRy
dWUsImlhdCI6MTUxNjIzOTAyMn0
.
KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

---

## Sources

- https://datatracker.ietf.org/doc/html/rfc7519
- https://youtu.be/SXmnrF3xfKo
- https://bytebytego.com/guides/guides/how-to-store-passwords-in-the-database/
