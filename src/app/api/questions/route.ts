import { NextResponse } from 'next/server';
import { quizQuestions } from '@/data/questions';

export async function GET() {
  try {
    console.log('Fetching questions...');

    // Simulate a small delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 100));

    // Shuffle the questions to provide a random set each time
    const shuffledQuestions = quizQuestions
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    console.log('Questions fetched successfully:', shuffledQuestions.length);

    return NextResponse.json(shuffledQuestions, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' }, 
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
