import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient'; // Adjust path if necessary
import './ResultPage.css'; // Import the CSS file
import RandomBackgroundComponent from "./RandomBackgroundComponent.js";

const ResultPage = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [topScorersSub1, setTopScorersSub1] = useState([]); // State for Subject 1
  const [topScorersSub2, setTopScorersSub2] = useState([]); // State for Subject 2
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const userName = localStorage.getItem('userName');

      if (!userName) {
        navigate('/'); // Redirect to homepage if no username is found
        return;
      }

      // Fetch user scores
      const { data, error } = await supabase
        .from('users')
        .select('sub1_current_score, sub1_high_score, sub2_current_score, sub2_high_score')
        .eq('name', userName)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      setCurrentScore(data.sub1_current_score); // Assuming you're showing Subject 1 score
      setHighScore(data.sub1_high_score); // Assuming you're showing Subject 1 high score

      // Fetch top scorers for both subjects
      const { data: scorersSub1, error: scorersErrorSub1 } = await supabase
        .from('users')
        .select('name, sub1_high_score')
        .order('sub1_high_score', { ascending: false })
        .limit(5);

      if (scorersErrorSub1) {
        console.error('Error fetching top scorers for Subject 1:', scorersErrorSub1);
        return;
      }

      setTopScorersSub1(scorersSub1);

      const { data: scorersSub2, error: scorersErrorSub2 } = await supabase
        .from('users')
        .select('name, sub2_high_score')
        .order('sub2_high_score', { ascending: false })
        .limit(5);

      if (scorersErrorSub2) {
        console.error('Error fetching top scorers for Subject 2:', scorersErrorSub2);
        return;
      }

      setTopScorersSub2(scorersSub2);
    };

    fetchResults();
  }, [navigate]);

  return (
    <div className="results-container">
      <RandomBackgroundComponent />
      <h1 className="results-title">Your Test Results</h1>
      <div className="results-score">
        <p><strong>Current Score:</strong> {currentScore}</p>
        <p><strong>High Score:</strong> {highScore}</p>
      </div>
      <div className="results-table-container">
        <h2 className="results-table-title">Top 5 High Scorers - Wild Life Ecology</h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>High Score</th>
            </tr>
          </thead>
          <tbody>
            {topScorersSub1.map((scorer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{scorer.name}</td>
                <td>{scorer.sub1_high_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="results-table-container">
        <h2 className="results-table-title">Top 5 High Scorers - Conservation Geography</h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>High Score</th>
            </tr>
          </thead>
          <tbody>
            {topScorersSub2.map((scorer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{scorer.name}</td>
                <td>{scorer.sub2_high_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate('/')} className="result-button">Back to Home</button>
      <button onClick={() => navigate('/test/subject1')} className="result-button">Go to Wild Life Ecology Test</button>
      <button onClick={() => navigate('/test/subject2')} className="result-button">Go to Conservation Geography Test</button>
    </div>
  );
};

export default ResultPage;
