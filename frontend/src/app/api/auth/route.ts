import { NextResponse } from 'next/server';

// This is a mock database of school codes. In a real application, this would be in a database.
const SCHOOL_CODES = {
  '123456': {
    id: 'school1',
    name: 'Demo School',
    studentCode: '123456',
    teacherCode: '654321',
  },
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // Check if it's a valid student code
    const school = Object.values(SCHOOL_CODES).find(
      (s) => s.studentCode === code || s.teacherCode === code
    );

    if (!school) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    // Create a user object
    const user = {
      id: `user_${Date.now()}`,
      schoolId: school.id,
      role: school.teacherCode === code ? 'teacher' : 'student',
      name: '', // Will be set in the next phase
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 