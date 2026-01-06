# Delete Account Feature

User account deletion functionality with automatic cascade deletion of all associated data.

## How It Works

### User Flow

1. User clicks **"Delete Account"** button in dashboard header
2. Alert dialog appears with warning and list of data to be deleted
3. User confirms deletion
4. Account and all data are permanently removed
5. User is redirected to home page

### What Gets Deleted

When a user deletes their account, the following data is **permanently removed**:

- ✅ User profile (`user_profiles` table)
- ✅ All text transformations (`transformations` table)
- ✅ All usage logs (`usage_logs` table)
- ✅ Subscription data (`subscriptions` table)
- ✅ User authentication record from Supabase Auth

### Technical Implementation

#### API Endpoint

**`DELETE /api/user/delete`**

Location: [app/api/user/delete/route.ts](../app/api/user/delete/route.ts)

**Process:**
1. Authenticates the user
2. Deletes user profile from database (cascades to all related tables)
3. Deletes user from Supabase Auth using service role
4. Signs out the user
5. Returns success response

**Security:**
- Requires authenticated user
- Uses service role key for Auth deletion (server-side only)
- Validates user before deletion
- Handles errors gracefully

#### UI Component

**`DeleteAccountButton`**

Location: [components/DeleteAccountButton.tsx](../components/DeleteAccountButton.tsx)

**Features:**
- Alert dialog with confirmation
- Lists all data that will be deleted
- Loading state during deletion
- Error handling with user-friendly messages
- Destructive styling (red button)

#### Database Cascade

The cascade deletion is handled by Prisma schema:

```prisma
model UserProfile {
  transformations   Transformation[]  // CASCADE on delete
  usageLogs         UsageLog[]        // CASCADE on delete
  subscription      Subscription?     // CASCADE on delete
}

model Transformation {
  user  UserProfile? @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For Auth deletion
```

## Usage in Dashboard

The delete button is located in the dashboard header, next to the Logout button:

```tsx
<DeleteAccountButton />
```

## Testing

### Manual Testing Steps

1. Create a test user account
2. Add some transformations
3. Click "Delete Account" button
4. Verify confirmation dialog appears
5. Click "Delete Account" in dialog
6. Verify:
   - Account is deleted from Supabase Auth
   - User profile is deleted from database
   - All transformations are deleted
   - User is redirected to home page
   - User cannot log in with deleted account

### Database Verification

After deletion, verify in Supabase dashboard:

```sql
-- Should return 0 rows
SELECT * FROM user_profiles WHERE id = 'deleted_user_id';
SELECT * FROM transformations WHERE user_id = 'deleted_user_id';
SELECT * FROM usage_logs WHERE user_id = 'deleted_user_id';
SELECT * FROM subscriptions WHERE user_id = 'deleted_user_id';
```

## Error Handling

The system handles these error cases:

1. **User not authenticated**: Returns 401
2. **Database deletion fails**: Returns 500 with error message
3. **Auth deletion fails**: Returns 500 with error message
4. **Network error**: Shows user-friendly error in UI
5. **User profile not found**: Continues to delete from Auth (handles edge case)

## Security Considerations

1. **Authorization**: Only authenticated users can delete their own account
2. **Service Role**: Uses service role key only on server-side (never exposed to client)
3. **Cascade Deletion**: Ensures no orphaned data remains in database
4. **Confirmation**: Requires explicit user confirmation before deletion
5. **Irreversible**: Action cannot be undone - clearly communicated to user

## Future Enhancements

Potential improvements:

- [ ] Add grace period (e.g., 30 days) before permanent deletion
- [ ] Email confirmation before deletion
- [ ] Export user data before deletion (GDPR compliance)
- [ ] Account deactivation option (soft delete)
- [ ] Audit log of account deletions
