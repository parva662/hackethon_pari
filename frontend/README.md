# LIFTS - Activity Cards App

A web application for low-literate, mildly cognitively impaired children to select activity cards and see collective preferences.

## Implementation Status

| Requirement | Description | Status |
|-------------|-------------|--------|
| **Authentication** | | |
| Simple access codes | 6-digit shared secret code authentication | ✅ Complete |
| School-specific codes | Different codes for different schools | ✅ Complete |
| Teacher authentication | Separate teacher access codes | ✅ Complete |
| **User Workflow** | | |
| Phase 1: Authentication | User enters access code | ✅ Complete |
| Phase 2: Name Input | User provides their game name | ✅ Complete |
| Phase 3: Card Selection | User selects activity cards | ✅ Complete |
| Phase 4: Results Display | User sees collective preferences | ⚠️ Basic version only |
| **Card Selection** | | |
| Card display | Visual display of card deck | ✅ Complete |
| Card animations | Cards "dance"/"shake" when selected | ✅ Complete |
| Selected card UI | Card moves to user's hand at bottom | ✅ Complete |
| Compatibility filtering | Only compatible cards shown after first selection | ✅ Complete |
| Card sorting | Cards sorted by ID before submission | ✅ Complete |
| Card submission | Submit button enabled after two cards selected | ✅ Complete |
| **Results Phase** | | |
| Submissions display | Show pairs by frequency | ⚠️ Basic version only |
| Winner determination | Highest frequency pairs shown as winners | ❌ Not implemented |
| Tie breaking | Countdown timer for eliminations | ❌ Not implemented |
| Visual cues | Skull cursor and highlighting | ❌ Not implemented |
| Winner celebration | Animations for winning pair | ❌ Not implemented |
| Real-time updates | WebSocket for live updates | ❌ Not implemented |
| **Admin Panel** | | |
| Teacher view | Table of submissions for school | ❌ Not implemented |
| Archive functionality | Teachers can archive submissions | ❌ Not implemented |
| Sorting | Submissions sorted by frequency | ❌ Not implemented |
| **Card Assets** | | |
| Card definitions | JSON structure with compatibility rules | ✅ Complete |
| Card images | Gender and race neutral images | ✅ Complete (SVG samples) |
| Documentation | How to customize cards | ✅ Complete |

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Codes

For testing, use the following codes:
- Student code: `123456` (Demo School)
- Teacher code: `654321` (Demo School)

## Customizing Cards

The activity cards are defined in `src/app/cards/card-definitions.json`. You can customize the existing cards or add new ones by modifying this file.

### Card Structure

Each card has the following properties:

```json
{
  "id": "unique_id",
  "title": "Card Title",
  "description": "Card description",
  "imageUrl": "/cards/assets/image_filename.svg",
  "compatibleCardIds": ["id_of_compatible_card", "another_id"]
}
```

- `id`: A unique identifier for the card. Use a consistent format (e.g., "card1", "card2").
- `title`: The title displayed on the card.
- `description`: A short description of the activity.
- `imageUrl`: Path to the card image. Images should be placed in the `public/cards/assets/` directory.
- `compatibleCardIds`: An array of IDs of other cards that are compatible with this one.

### Adding New Cards

To add a new card:

1. Create an image for the card and place it in `public/cards/assets/`
2. Add a new card object to the `cards` array in `card-definitions.json`
3. Make sure to update the `compatibleCardIds` of existing cards if they should be compatible with the new card
4. Also update the `compatibleCardIds` of the new card to include IDs of compatible existing cards

### Card Images

Card images should have the following characteristics:

- Use SVG or JPG/PNG format (SVG recommended for scalability)
- Aim for a 3:4 aspect ratio (300x400px recommended)
- Keep file sizes small for better performance
- Use inclusive, age-appropriate imagery that avoids gender and racial stereotypes
- For custom images, you can use graphic design tools or AI image generators with appropriate prompts

### Example: Adding a New Card

1. Create an image `hiking.svg` and place it in `public/cards/assets/`
2. Add to `card-definitions.json`:

```json
{
  "id": "card6",
  "title": "Nature Hiking",
  "description": "Explore nature trails together",
  "imageUrl": "/cards/assets/hiking.svg",
  "compatibleCardIds": ["card1", "card3", "card5"]
}
```

3. Update the compatible cards to include this new card:

```json
// In card1
"compatibleCardIds": ["card2", "card3", "card4", "card6"]

// In card3
"compatibleCardIds": ["card1", "card2", "card4", "card5", "card6"]

// In card5
"compatibleCardIds": ["card2", "card3", "card4", "card6"]
```

## Project Structure

- `src/app/cards/`: Contains card definitions and related files
- `public/cards/assets/`: Contains card images
- `src/components/`: React components for the app
- `src/app/api/`: API routes for authentication and submissions

## Advanced Customization

For more advanced customization, you can modify:

- The animation timing and effects in `src/app/globals.css`
- The card selection logic in `src/components/CardSelection.tsx`
- The submission handling in `src/app/api/submissions/route.ts`
