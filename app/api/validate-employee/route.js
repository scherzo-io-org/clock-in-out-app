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

    if (result.recordset.length === 1) {
      return NextResponse.json({ valid: true, employee : result.recordset[0] });
    } else if (result.recordset.length === 0) {
      return NextResponse.json({ valid: false, reason : `Error: Couldn't find an employee matching these last-four` });
    } else if (result.recordset.length > 1) {
      return NextResponse.json({ valid: false, reason : `Error: More than one employee has these last-four` });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
}