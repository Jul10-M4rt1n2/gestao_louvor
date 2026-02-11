# Ministry CRUD System - Implementation Needed

## Problem Statement

**Issue:** "o ministerio nao tem [formulários], eu acredito que seja por que ele é a base, fonte primaria para poder cadastrar os demais. Porem poderia ter informativos dizendo 'cadastre isso primeiro antes de cadastrar esse outro'. Por que agora eu preciso colocar o sistema pra funcionar com dados reais, mas nao consigo cadastrar os ministérios."

**Current State:**
- Ministry model exists (`app/Models/Ministry.php`)
- No controllers for Ministry
- No pages for Ministry CRUD
- No way to create ministries from UI
- Ministries are required before creating groups
- Cannot use system with real data

## Why This Is Critical

Ministries are the **foundation** of the data hierarchy:
```
Organizations
    └── Ministries (Louvor, Adoração, Jovens, etc.)
        └── Groups (Equipe A, Equipe B, etc.)
            └── Schedules/Scales (Culto Domingo, Ensaio, etc.)
                └── Music + Participants
```

Without Ministry CRUD, users cannot:
- Create the base organizational structure
- Create groups (requires ministry_id)
- Use the system with real church data

## Required Implementation

### Backend Components Needed

1. **MinistryController** (`app/Http/Controllers/Ministry/MinistryController.php`)
   - index() - List all ministries
   - create() - Show creation form
   - store() - Save new ministry
   - show() - View ministry details  
   - edit() - Show edit form
   - update() - Update ministry
   - destroy() - Soft delete

2. **MinistryService** (`app/Services/Ministry/MinistryService.php`)
   - getPaginated() with search
   - create(), update(), delete()
   - Organization-scoped queries
   - Count associated groups

3. **StoreMinistryRequest** (`app/Http/Requests/Ministry/StoreMinistryRequest.php`)
   - Validation rules for creation
   - Portuguese error messages

4. **UpdateMinistryRequest** (`app/Http/Requests/Ministry/UpdateMinistryRequest.php`)
   - Validation rules for updates
   - Portuguese error messages

5. **MinistryResource** (`app/Http/Resources/MinistryResource.php`)
   - API serialization
   - Include groups count
   - Include organization data

6. **MinistryPolicy** (`app/Policies/MinistryPolicy.php`)
   - Organization-scoped authorization
   - viewAny, view, create, update, delete permissions

### Frontend Components Needed

1. **Ministry/Index.jsx** - List page
   - Search by name/description
   - Color-coded badges
   - Icon display
   - Active status indicators
   - Group count for each ministry
   - Empty state with helpful setup message
   - Create button

2. **Ministry/Create.jsx** - Creation form
   - Name (required)
   - Description (textarea)
   - Icon (optional text field - emoji or icon name)
   - Color picker (7-character hex, e.g., #FF5733)
   - Active status toggle (default: true)
   - Form validation
   - Cancel and Save buttons

3. **Ministry/Edit.jsx** - Edit form
   - Pre-filled fields
   - Update functionality
   - Delete button with confirmation modal (z-50!)
   - Cancel and Save buttons
   - Show associated groups count

4. **Ministry/Show.jsx** (optional but recommended)
   - Ministry information display
   - List of associated groups
   - Statistics
   - Edit button
   - Back to list button

### Integration

**Routes to Add** (`routes/web.php`):
```php
Route::middleware('auth')->group(function () {
    // ... existing routes ...
    
    Route::resource('ministries', MinistryController::class);
});
```

**Navigation Update** (`resources/js/Layouts/AppLayout.jsx`):
Add menu item before "Grupos":
```jsx
<Link
    href="/ministries"
    className="..."
>
    🎭 Ministérios
</Link>
```

**Policy Registration** (`app/Providers/AppServiceProvider.php`):
```php
use App\Models\Ministry;
use App\Policies/MinistryPolicy;

Gate::policy(Ministry::class, MinistryPolicy::class);
```

### Informative Messages Needed

**Dashboard Enhancement:**
Add a "Setup Guide" card showing recommended order:
1. ✅ First: Create Ministries (Louvor, Adoração, etc.)
2. ✅ Second: Create Groups (Equipe A, Equipe B, etc.)
3. ✅ Third: Add Music to library
4. ✅ Finally: Create Schedules/Scales

**Empty State Messages:**

**Groups Index (when no groups exist):**
```
"Nenhum grupo encontrado. 
⚠️ Você precisa criar ao menos um Ministério antes de criar grupos.
👉 Vá para Ministérios para começar."
```

**Scales Index (when no schedules exist):**
```
"Nenhuma escala encontrada.
⚠️ Para criar escalas, você precisa:
1. Ter ministérios cadastrados
2. Ter grupos cadastrados
3. Ter músicas na biblioteca
👉 Configure primeiro os itens acima."
```

## Implementation Pattern

Follow the exact same pattern as:
- Music CRUD system (for reference)
- Group CRUD system (for reference)
- Scale CRUD system (for reference)

**Key Patterns to Maintain:**
- SOLID architecture (Service, Controller, Policy layers)
- Type-safe PHP with strict typing
- Inertia.js for frontend-backend integration
- TailwindCSS for styling
- Portuguese localization
- Responsive design
- Form validation with clear error messages
- Loading states during operations
- Success/error feedback after operations

## Database Schema (Already Exists)

```sql
CREATE TABLE ministries (
    id BIGINT UNSIGNED PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT NULL,
    icon VARCHAR(255) NULL,
    color VARCHAR(7) NULL,  -- hex color, e.g., #FF5733
    active BOOLEAN DEFAULT TRUE,
    organization_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

## Testing Checklist

After implementation, verify:
- [ ] Can navigate to /ministries
- [ ] Can create a new ministry
- [ ] Can view ministry list
- [ ] Can search ministries
- [ ] Can edit a ministry
- [ ] Can delete a ministry (with confirmation modal visible!)
- [ ] Can see ministries in group creation dropdown
- [ ] Empty states show helpful messages
- [ ] Dashboard shows setup guide
- [ ] All forms validate correctly
- [ ] All authorization works (organization-scoped)

## Priority

**HIGH PRIORITY** - This blocks real-world usage of the system.

Without this implementation, users cannot:
- Set up their church structure
- Use the system with real data
- Create groups (requires ministry)
- Properly organize their worship teams

## Estimated Effort

- Backend (6 files): ~2-3 hours
- Frontend (4 pages): ~3-4 hours
- Integration & testing: ~1 hour
- **Total: 6-8 hours**

## Notes

This is the **last major piece** needed for the system to be fully functional with real-world church data. Once implemented, the complete workflow will be:

1. User logs in
2. Creates Ministries (Louvor, Adoração, Jovens, etc.)
3. Creates Groups within Ministries (Equipe A, Equipe B, etc.)
4. Adds Music to library
5. Creates Schedules/Scales for services
6. Adds music and participants to schedules

**This completes the core worship management system!** 🎵⛪
