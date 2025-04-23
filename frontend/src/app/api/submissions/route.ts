import { NextResponse } from 'next/server';

// In a real application, this would be stored in a database
let submissions: Array<{
  id: string;
  cardIds: [string, string];
  schoolId: string;
  userName: string;
  timestamp: Date;
}> = [];

export async function POST(request: Request) {
  try {
    const { cardIds, schoolId, userName } = await request.json();

    // Ensure we have exactly 2 card IDs and they are sorted
    if (!cardIds || !Array.isArray(cardIds) || cardIds.length !== 2) {
      return NextResponse.json({ error: 'Two cards must be selected' }, { status: 400 });
    }

    // Create a new submission
    const submission = {
      id: `submission_${Date.now()}`,
      cardIds: cardIds.sort() as [string, string],
      schoolId,
      userName,
      timestamp: new Date(),
    };

    // Add it to our "database"
    submissions.push(submission);

    // Return the submission
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Get submissions for a specific school
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  // Filter submissions by school
  const schoolSubmissions = submissions.filter(s => s.schoolId === schoolId);

  // Calculate frequencies of each pair
  const pairFrequencies: Record<string, number> = {};
  
  schoolSubmissions.forEach(submission => {
    const pairKey = submission.cardIds.join('_');
    pairFrequencies[pairKey] = (pairFrequencies[pairKey] || 0) + 1;
  });

  // Get unique pairs and sort by frequency
  const pairs = Object.entries(pairFrequencies)
    .map(([pairKey, frequency]) => ({
      cardIds: pairKey.split('_') as [string, string],
      frequency,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  return NextResponse.json({ submissions: schoolSubmissions, pairs });
} 