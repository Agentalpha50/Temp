import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './HomePage.css';
import RandomBackgroundComponent from "./RandomBackgroundComponent.js";

const HomePage = () => {
  const [name, setName] = useState('');
  const [alert, setAlert] = useState('');
  const [topScorersSub1, setTopScorersSub1] = useState([]);
  const [topScorersSub2, setTopScorersSub2] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopScorers = async () => {
      // Fetch top scorers for Subject 1
      const { data: scorersSub1, error: errorSub1 } = await supabase
        .from('users')
        .select('name, sub1_high_score')
        .order('sub1_high_score', { ascending: false })
        .limit(5);

      if (errorSub1) {
        console.error('Error fetching top scorers for Subject 1:', errorSub1);
        return;
      }

      setTopScorersSub1(scorersSub1);

      // Fetch top scorers for Subject 2
      const { data: scorersSub2, error: errorSub2 } = await supabase
        .from('users')
        .select('name, sub2_high_score')
        .order('sub2_high_score', { ascending: false })
        .limit(5);

      if (errorSub2) {
        console.error('Error fetching top scorers for Subject 2:', errorSub2);
        return;
      }

      setTopScorersSub2(scorersSub2);
    };

    fetchTopScorers();
  }, []);

  const handleStartTest = async (subject) => {
    if (!name.trim()) {
      setAlert('Please enter your name.');
      return;
    }

    // Check if the user already exists
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      return;
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ name, sub1_current_score: 0, sub1_high_score: 0, sub2_current_score: 0, sub2_high_score: 0 }]);

      if (insertError) {
        console.error('Error inserting user:', insertError);
        return;
      }
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('subject', subject);
    navigate(`/test/${subject}`);
  };

  return (
    <div className="homepage-container">
      <RandomBackgroundComponent />
      <h1 className="homepage-title">Welcome to SmartPrep</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="homepage-input"
      />
      <div className="subject-buttons">
        <button onClick={() => handleStartTest('subject1')} className="subject-button">Wild Life Ecology</button>
        <button onClick={() => handleStartTest('subject2')} className="subject-button">Conservation Geography</button>
      </div>
      {alert && <div className="homepage-alert">{alert}</div>}
      <div className="top-scorers">
        <h2 className="top-scorers-title">Top 5 High Scorers for Wild Life Ecology</h2>
        <table className="top-scorers-table">
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
        <h2 className="top-scorers-title">Top 5 High Scorers for Conservation Geography</h2>
        <table className="top-scorers-table">
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
    </div>
  );
};

export default HomePage;
