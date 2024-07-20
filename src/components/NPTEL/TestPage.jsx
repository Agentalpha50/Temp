import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import your Supabase client

const TestPage = () => {
  const [name, setName] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Retrieve the user's data from Supabase
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data) {
        setCurrentScore(data.current_score);
        setHighScore(data.high_score);
      }
    };

    fetchData();
  }, [name]);

  const handleSubmitScore = async (newScore) => {
    if (newScore > highScore) {
      // Update the high score if the new score is higher
      const { error } = await supabase
        .from('users')
        .update({ current_score: newScore, high_score: newScore })
        .eq('name', name);

      if (error) {
        console.error('Error updating score:', error);
        return;
      }
    } else {
      // Just update the current score
      const { error } = await supabase
        .from('users')
        .update({ current_score: newScore })
        .eq('name', name);

      if (error) {
        console.error('Error updating score:', error);
        return;
      }
    }
  };

  return (
    <div>
      <h1>Test Page</h1>
      <p>Current Score: {currentScore}</p>
      <p>High Score: {highScore}</p>
      {/* Add your test UI here */}
      <button onClick={() => handleSubmitScore(/* newScore here */)}>Submit Score</button>
    </div>
  );
};

export default TestPage;
