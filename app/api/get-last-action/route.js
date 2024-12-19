import { NextResponse } from 'next/server';
import { getDBConnection, sql } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rep = searchParams.get('rep');

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('rep', sql.VarChar, rep)
      .query(`SELECT TOP 1 * FROM clockinsouts WHERE REP = @rep AND AND timestamp_in >= DATEADD(HOUR, 2, CONVERT(DATETIME, CONVERT(VARCHAR(8), GETDATE(), 112))) ORDER BY timestamp_in DESC`);

    if (result.recordset.length > 0) {
      return NextResponse.json({ success: true, lastAction: result.recordset[0] });
    } else {
      return NextResponse.json({ success: true, lastAction: null });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
}
