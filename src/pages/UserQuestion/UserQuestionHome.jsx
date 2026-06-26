import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserQuestionHome = () => {

  const location = useLocation();
  const userData = location.state || {};

  console.log('User data from navigation state:', userData);  

  return (
    <div>
      UserQuestionHome
    </div>
  )
}

export default UserQuestionHome
