import pool from '../config/db.js';

// 创建笔记
export const createLibrary = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO library ( user_id, book_id ) VALUES (?, ?)',
      [userId, bookId]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      bookId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取指定书籍的评论
export const getLibrarysByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const [rows] = await pool.query(
        'SELECT * FROM library WHERE user_id = ?',
        [userId]
      );
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// 获取单个笔记
export const getLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM library WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'library not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 删除笔记
export const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM library WHERE id = ?', [id]);
    res.status(200).json({ message: 'library deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};