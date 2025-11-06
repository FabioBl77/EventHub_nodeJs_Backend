import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form.username, form.email, form.password);
      setMessage(res.message || 'Registrazione avvenuta! Controlla la tua email per la conferma.');
    } catch (err) {
      setMessage('Errore nella registrazione');
    }
  };

  return (
    <div className="register">
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Crea account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
