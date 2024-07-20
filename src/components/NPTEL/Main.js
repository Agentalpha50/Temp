import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import QuestionBlock from "./QuestionBlock.js";
import RandomBackgroundComponent from "./RandomBackgroundComponent.js";
import LoadingScreen from "./LoadingScreen.js";

const Main = () => {
    const [score, setScore] = useState(0);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            let { data: questions, error } = await supabase
                .from('new_questions')
                .select('*');

            if (error) {
                console.error("Error fetching questions:", error);
            } else {
                const shuffledData = [...questions].sort(() => Math.random() - 0.5);
                setShuffledQuestions(shuffledData);
            }
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchQuestions();
    }, []);

    const incrementScore = () => {
        setScore(score + 1);
    };

    const handleSubmit = async () => {
        const userName = localStorage.getItem('userName');

        if (!userName) {
            console.error('No username found in localStorage.');
            return;
        }

        const { data, error } = await supabase
            .from('users')
            .select('current_score, high_score')
            .eq('name', userName)
            .single();

        if (error) {
            console.error('Error fetching user data:', error);
            return;
        }

        const newHighScore = Math.max(score, data.high_score);

        const { error: updateError } = await supabase
            .from('users')
            .update({
                current_score: score,
                high_score: newHighScore
            })
            .eq('name', userName);

        if (updateError) {
            console.error('Error updating score:', updateError);
            return;
        }

        navigate('/result');
    };

    if (loading) {
        return <LoadingScreen />; // Display loading screen component while fetching data
    }

    return (
        <div className="wrapper">
            <RandomBackgroundComponent />
            <div className="score">Score: {score} / 120</div>
            {
                shuffledQuestions.map((eachQuestion, index) => (
                    <QuestionBlock
                        key={index}
                        question={(index + 1) + ". " + eachQuestion["question"]}
                        a={eachQuestion["a"]}
                        b={eachQuestion["b"]}
                        c={eachQuestion["c"]}
                        d={eachQuestion["d"]}
                        correctAnswer={eachQuestion["answer"]}
                        scoreIncrementFunction={incrementScore}
                    />
                ))
            }
            <div className="button-container">
                <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>
        </div>
    );
}

export default Main;
