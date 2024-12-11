import React from 'react';
import {  useParams } from 'react-router-dom';

function DynamicPage() {
  const { id } = useParams();

  // Fetch or validate the `id` and display content accordingly
  React.useEffect(() => {
    // Example: Fetch or process `id`
    console.log('Processing ID:', id);
  }, [id]);

  return (
    <div>
      <h1>Checkout Page</h1>
      <p>Processing ID: {id}</p>
    </div>
  );
}


export default DynamicPage

