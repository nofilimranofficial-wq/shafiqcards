import React from 'react';
import Slider from '../components/Slider';
import AnimatedCards from '../components/AnimatedCards';
import CategoryCards from '../components/CategoryCards';
import Button from '../components/Button';
// import ServicesSection from '../components/ServicesSection';

const Home = () => {


  return (
    <div className="text-slate-900">
      <AnimatedCards limit={8} buttonLink="/invitations" />
      <Slider />
      <CategoryCards />
    

      

      
      
    </div>
  );
};

export default Home;
