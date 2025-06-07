

// // --------------------------- PAYMENTS API ROUTES ---------------------------
// import { Router } from "express";
// const router = Router();
// import pool from '../db.js';


// // 📌 Get all payments
// router.get('/api/payments', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT payment_id, amount, payment_date, payment_method FROM payments');
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // 📌 Add a new payment
// router.post('/api/payments', async (req, res) => {
//     const { payment_id, amount, payment_date, payment_method } = req.body;
//     try {
//         const result = await pool.query(
//             'INSERT INTO payments (payment_id, amount, payment_date, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
//             [payment_id, amount, payment_date, payment_method]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // 📌 Update a payment
// router.put('/api/payments/:payment_id', async (req, res) => {
//     const { payment_id } = req.params;
//     const { amount, payment_date, payment_method } = req.body;
//     try {
//         const result = await pool.query(
//             'UPDATE payments SET amount=$1, payment_date=$2, payment_method=$3 WHERE payment_id=$4 RETURNING *',
//             [amount, payment_date, payment_method, payment_id]
//         );
//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // 📌 Delete a payment
// router.delete('/api/payments/:payment_id', async (req, res) => {
//     const { payment_id } = req.params;
//     try {
//         await pool.query('DELETE FROM payments WHERE payment_id=$1', [payment_id]);
//         res.status(200).json({ message: 'Payment deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });


// export default router;


// --------------------------- PAYMENTS API ROUTES ---------------------------
// import { Router } from "express";
// const router = Router();
// import pool from '../db.js';

// // 📌 Get all payments
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT payment_id, amount, payment_date, payment_method FROM payments');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // 📌 Add a new payment
// router.post('/', async (req, res) => {
//   const { payment_id, amount, payment_date, payment_method } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO payments (payment_id, amount, payment_date, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
//       [payment_id, amount, payment_date, payment_method]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // 📌 Update a payment
// router.put('/:payment_id', async (req, res) => {
//   const { payment_id } = req.params;
//   const { amount, payment_date, payment_method } = req.body;
//   try {
//     const result = await pool.query(
//       'UPDATE payments SET amount=$1, payment_date=$2, payment_method=$3 WHERE payment_id=$4 RETURNING *',
//       [amount, payment_date, payment_method, payment_id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // 📌 Delete a payment
// router.delete('/:payment_id', async (req, res) => {
//   const { payment_id } = req.params;
//   try {
//     await pool.query('DELETE FROM payments WHERE payment_id=$1', [payment_id]);
//     res.status(200).json({ message: 'Payment deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// export default router;

import { Router } from "express";
const router = Router();
import pool from '../db.js';

// 📌 Get all payments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT payment_id, amount, payment_date, payment_method FROM payments'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Add a new payment
router.post('/', async (req, res) => {
  const { payment_id, amount, payment_date, payment_method } = req.body;
  console.log("Received payment data:", req.body);

  try {
    const query = `
      INSERT INTO payments (payment_id, amount, payment_date, payment_method)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [payment_id, amount, payment_date, payment_method];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding payment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Update a payment
router.put('/:payment_id', async (req, res) => {
  const { payment_id } = req.params;
  const { amount, payment_date, payment_method } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE payments
      SET amount = $1,
          payment_date = $2,
          payment_method = $3
      WHERE payment_id = $4
      RETURNING *;
      `,
      [amount, payment_date, payment_method, payment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Delete a payment
router.delete('/:payment_id', async (req, res) => {
  const id = parseInt(req.params.payment_id, 10);
  console.log("Received delete request for payment ID:", id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid payment ID' });
  }

  try {
    const result = await pool.query('DELETE FROM payments WHERE payment_id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
