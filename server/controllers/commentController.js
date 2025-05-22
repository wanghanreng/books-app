import pool from '../config/db.js';

// 创建笔记
export const createComment = async (req, res) => {
  try {
    const { userId, content, bookId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO comments ( user_id, content, book_id ) VALUES (?, ?, ?)',
      [userId, content, bookId]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      content,
      bookId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 获取指定书籍的评论
export const getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE book_id = ?',
      [bookId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const [rows] = await pool.query(
        'SELECT * FROM comments WHERE user_id = ?',
        [userId]
      );
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// 获取单个笔记
export const getComment = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新评论
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, id]
    );
    res.status(200).json({ id, content});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除笔记
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};