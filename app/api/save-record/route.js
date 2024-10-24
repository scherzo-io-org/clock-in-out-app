import { NextResponse } from 'next/server';
import { getDBConnection, sql } from '@/lib/db';

export async function POST(request) {
  const { id, action, imageUrl } = await request.json();

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('id_num', sql.VarChar, id)
      .input('type', sql.VarChar, action)
      .input('image_url', sql.NVarChar, imageUrl)
      .query(`INSERT INTO clockinsouts (REP, type, timestamp_in, image_url)
      VALUES (@id_num, @type, GETDATE(), @image_url)`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database insertion error' }, { status: 500 });
  }
}
