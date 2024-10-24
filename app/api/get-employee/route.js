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
      .query(`SELECT LoginID , FirstName , LastName FROM stafflogininfo WHERE status='active' and RIGHT(SocialSecurityNumber, 4) = @id_num`);

    if (result.recordset.length > 0) {
      return NextResponse.json({ success: true, employee: result.recordset[0] });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
}