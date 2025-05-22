import pool from '../config/db.js';

// 创建笔记
export const createBook = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO books ( title, content, category_id ) VALUES (?, ?, ?)',
      [title, content, categoryId]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      content,
      categoryId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取图书列表  
export const getBooks = async (req, res) => {  
    try {  
        const [rows] = await pool.query('SELECT * FROM books');  
        res.status(200).json(rows);  
    } catch (error) {  
        res.status(500).json({ error: error.message });  
    }  
};

// 获取指定分类的笔记
export const getBooksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM books WHERE category_id = ?',
      [categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId} = req.body;
    await pool.query(
      'UPDATE books SET title = ?, content = ?, category_id = = ? WHERE id = ?',
      [title, content, categoryId, id]
    );
    res.status(200).json({ id, title, content, categoryId});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除笔记
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};