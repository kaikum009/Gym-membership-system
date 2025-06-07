
// --------------------------- MEMBERS API ROUTES ---------------------------
import express from "express";
const router = express.Router();
import pool from '../db.js';



// 📌 Get all members
router.get('/', async (req, res) => {
    try {
        console.log('Getting all members')
        const result = await pool.query('SELECT id_no, name, email, phone, start_date, end_date FROM members');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

  
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;
    console.log("Received data:", req.body);
  
    const today = new Date().toISOString().split('T')[0];
  
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    const nextYear = nextYearDate.toISOString().split('T')[0];
  
    try {
      const query = `
        INSERT INTO members (name, email, phone, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [name, email, phone, today, nextYear];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// 📌 Update a member
router.put('/:id_no', async (req, res) => {
    const { id_no } = req.params;
    const { name, email, phone, start_date, end_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE members SET name=$1, email=$2, phone=$3, start_date=$4, end_date=$5 WHERE id_no=$6 RETURNING *',
            [name, email, phone, start_date, end_date, id_no]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📌 Delete a member
// app.delete('/api/members/:id_no', async (req, res) => {
//     console.log("Received delete request for ID:", id_no); // Debug
//     const { id_no } = req.params;
    
//     try {
//         await pool.query('DELETE FROM members WHERE id_no=$1', [id_no]);
//         res.status(200).json({ message: 'Member deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// app.delete('/api/members/:id_no', async (req, res) => {
//     const id = parseInt(req.params.id_no, 10);
//     const { id_no } = req.params;  // Corrected: Destructure id_no first
//     console.log("Received delete request for ID:", id_no); // Debug

//     try {
//         // Perform the deletion
//         await pool.query('DELETE FROM members WHERE id_no=$1', [id_no]);

//         // Respond with success
//         res.status(200).json({ message: 'Member deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting member:', err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

router.delete('/:id_no', async (req, res) => {
    const id = parseInt(req.params.id_no, 10);
    console.log("Received delete request for ID:", id); // Debug

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid member ID' });
    }

    try {
        const result = await pool.query('DELETE FROM members WHERE id_no = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;



