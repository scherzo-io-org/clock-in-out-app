import { NextResponse } from 'next/server';
import { getDBConnection, sql } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('id_num', sql.VarChar, id)
      .query(`SELECT * FROM EmployeeList WHERE id_num = @id_num`);
    if (result.recordset.length > 0) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
}