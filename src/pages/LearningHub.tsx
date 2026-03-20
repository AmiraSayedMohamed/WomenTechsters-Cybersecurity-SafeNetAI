import React, { useState } from 'react';
import { Card, Container, Heading, Text, Button, Box, Tabs } from '@radix-ui/themes';
import { processSafetyRequest } from '../components/AIEngine.ts';

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  completed: boolean;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const LearningHub: React.FC = () => {
  const [quizzes] = useState<Quiz[]>([
    {
      id: 1,
      title: 'Network Security Basics',
      description: 'Learn fundamental concepts of network security',
      completed: false,
      questions: [
        {
          id: 1,
          text: 'What does VPN stand for?',
          options: ['Virtual Private Network', 'Very Personal Network', 'Virtual Protocol Network', 'Virtual Proxy Network'],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: 'What is a firewall?',
          options: ['A protective barrier', 'A type of malware', 'A network cable', 'A password manager'],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: 2,
      title: 'Phishing Protection',
      description: 'Understand how to identify and protect against phishing attacks',
      completed: false,
      questions: [
        {
          id: 1,
          text: 'What is phishing?',
          options: ['Fraudulent emails', 'Real fishing', 'A type of coding', 'A network protocol'],
          correctAnswer: 0,
        },
      ],
    },
  ]);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [tutorMessage, setTutorMessage] = useState('');
  const [lastTutorQuestion, setLastTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuizStart = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setUserAnswer(null);
  };

  const handleAnswer = (optionIndex: number) => {
    setUserAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedQuiz && userAnswer !== null) {
      const question = selectedQuiz.questions[currentQuestion];
      if (userAnswer === question.correctAnswer) {
        alert('Correct!');
      } else {
        alert('Incorrect. Try again!');
      }
      setUserAnswer(null);
      if (currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handleAskTutor = async () => {
    const question = tutorMessage.trim();
    if (!question) return;
    
    setLoading(true);
    setLastTutorQuestion(question);
    try {
      const response = await processSafetyRequest('TUTOR', question);
      
      if (response.success) {
        setTutorResponse(response.answer || 'No response received');
      } else {
        setTutorResponse(`Error: ${response.error}`);
      }
    } catch (error) {
      setTutorResponse(`Error: Unable to get response from AI tutor`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <Heading size="9" className="mb-6 text-center dark:text-white">
        Learning Hub
      </Heading>

      <Tabs.Root defaultValue="quizzes">
        <Tabs.List>
          <Tabs.Trigger value="quizzes">Quizzes</Tabs.Trigger>
          <Tabs.Trigger value="tutor">AI Tutor</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="quizzes" className="mt-6">
          {!selectedQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuizStart(quiz)}>
                  <Heading size="6" className="mb-2">
                    {quiz.title}
                  </Heading>
                  <Text className="mb-4">{quiz.description}</Text>
                  <Button onClick={() => handleQuizStart(quiz)}>Start Quiz</Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <Heading size="6" className="mb-6">
                {selectedQuiz.title}
              </Heading>
              {currentQuestion < selectedQuiz.questions.length ? (
                <>
                  <Text className="mb-4 font-semibold">
                    Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                  </Text>
                  <Text className="mb-6 text-lg">
                    {selectedQuiz.questions[currentQuestion].text}
                  </Text>
                  <div className="space-y-3 mb-6">
                    {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          userAnswer === index
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Box className="flex gap-3">
                    <Button onClick={handleSubmitAnswer} disabled={userAnswer === null}>
                      Submit Answer
                    </Button>
                    <Button variant="soft" onClick={() => { setSelectedQuiz(null); setCurrentQuestion(0); }}>
                      Back to Quizzes
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Text className="mb-6 text-lg font-semibold">Quiz Completed!</Text>
                  <Button onClick={() => { setSelectedQuiz(null); setCurrentQuestion(0); }}>
                    Back to Quizzes
                  </Button>
                </>
              )}
            </Card>
          )}
        </Tabs.Content>

        <Tabs.Content value="tutor" className="mt-6">
          <Card className="p-6">
            <Heading size="6" className="mb-4">
              Ask the AI Tutor
            </Heading>
            <Text className="mb-4">Ask any cybersecurity-related question and get instant help</Text>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ask your question..."
                value={tutorMessage}
                onChange={(e) => setTutorMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskTutor()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              
              <Button onClick={handleAskTutor} disabled={loading || !tutorMessage.trim()}>
                {loading ? 'Thinking...' : 'Ask AI Tutor'}
              </Button>

              {tutorResponse && (
                <Card className="p-4 bg-blue-50">
                  {lastTutorQuestion && (
                    <Text className="mb-2 font-semibold text-slate-700">
                      You asked: {lastTutorQuestion}
                    </Text>
                  )}
                  <Text className="whitespace-pre-wrap">{tutorResponse}</Text>
                </Card>
              )}
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
};

export default LearningHub;
