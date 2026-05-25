# PetPal Database Design

## Entity Relationship Diagram (text)

users (1) ──< pets (many)
  |
  └──< friendships as requester (many)
  └──< friendships as addressee (many)
  └──< messages as sender (many)
  └──< messages as receiver (many)

pets (1) ──< pet_matches as requester (many)
pets (1) ──< pet_matches as target (many)

## Relationships:
- users ↔ users: many-to-many via friendships (self-referential)
- users ↔ messages: one-to-many (sender or receiver)
- pets ↔ pet_matches: one-to-many (as requester or target)

## Indexes (for performance):
- idx_messages_conversation: (sender_id, receiver_id, created_at)
- idx_friendships_status: (status, created_at)
- idx_pet_matches_pending: (status, created_at)
