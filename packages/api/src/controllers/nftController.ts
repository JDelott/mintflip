import type { Request, Response } from 'express';
import { pool } from '../db/connection';

export const addMusicNFT = async (req: Request, res: Response) => {
  const { tokenId, name, artist, description, genre, price, ipfsUri, imageUri, audioUri, ownerAddress, licenseType } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO music_nfts (
        token_id, name, artist, description, genre, price_eth, 
        ipfs_uri, image_uri, audio_uri, owner_address, license_type, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) RETURNING id`,
      [tokenId, name, artist, description, genre, price, ipfsUri, imageUri, audioUri, ownerAddress, licenseType]
    );
    
    return res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error adding music NFT:', error);
    return res.status(500).json({ message: 'Server error adding music NFT' });
  }
};

export const getMusicNFTs = async (req: Request, res: Response) => {
  const { limit = 20, offset = 0, genre } = req.query;
  
  try {
    const query = `
      SELECT * FROM music_nfts
      ${genre ? 'WHERE genre = $3' : ''}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const params = genre ? [limit, offset, genre] : [limit, offset];
    const result = await pool.query(query, params);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting music NFTs:', error);
    return res.status(500).json({ message: 'Server error getting music NFTs' });
  }
};

export const getUserTracks = async (req: Request, res: Response) => {
  const { address } = req.params;
  
  if (!address) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  try {
    const result = await pool.query(
      `SELECT * FROM music_nfts WHERE owner_address = $1 ORDER BY created_at DESC`,
      [address]
    );
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting user tracks:', error);
    return res.status(500).json({ message: 'Server error getting user tracks' });
  }
};
