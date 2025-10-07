// backend/src/database/database.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { promisify } from 'util';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: sqlite3.Database;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database('./favorites.db', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  private async createTables(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS favorites (
        imdbID TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        year TEXT NOT NULL,
        poster TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Favorites table created or already exists');
          resolve();
        }
      });
    });
  }


  async getAllFavorites(): Promise<any[]> {
    const sql = 'SELECT * FROM favorites ORDER BY created_at DESC';
    
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Convert database format back to movie format
          const movies = rows.map((row: any) => ({
            imdbID: row.imdbID,
            Title: row.title,
            Year: row.year,
            Poster: row.poster
          }));
          resolve(movies);
        }
      });
    });
  }

  async addFavorite(movie: any): Promise<any> {
    const sql = `
      INSERT INTO favorites (imdbID, title, year, poster)
      VALUES (?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, [movie.imdbID, movie.Title, movie.Year, movie.Poster], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            resolve({ error: 'Movie already in favorites' });
          } else {
            reject(err);
          }
        } else {
          resolve(movie);
        }
      });
    });
  }

  async removeFavorite(imdbID: string): Promise<any> {
    const sql = 'DELETE FROM favorites WHERE imdbID = ?';
    
    return new Promise((resolve, reject) => {
      this.db.run(sql, [imdbID], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve({ error: 'Movie not found in favorites' });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  async checkFavoriteExists(imdbID: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM favorites WHERE imdbID = ? LIMIT 1';
    
    return new Promise((resolve, reject) => {
      this.db.get(sql, [imdbID], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  }
}
