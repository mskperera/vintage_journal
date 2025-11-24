import moment from 'moment';
import 'moment-timezone';   // ← this line is REQUIRED

const PAGE_IMG = 'https://clpos.legendbyte.com/api/v1/asset/4e2f310fc380567c97f3475480bb54f5?width=200&height=200&quality=80';

// Optional: Pass user timezone from App, or detect once
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function EntryGrid({ entries, onSelectEntry, timezone = USER_TIMEZONE }) {
  if (!entries || entries.length === 0) {
    return (
      <p style={{ textAlign: 'center', opacity: 0.6, fontStyle: 'italic', fontSize: '1.3rem', marginTop: '3rem' }}>
        No entries yet. Start writing today!
      </p>
    );
  }

  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center', padding: '3rem 2rem' }}>
      {entries.map((utcDateStr) => {
        // Convert UTC date string to user's local time
      //  const localDate = moment.tz(utcDateStr, 'YYYY-MM-DD', timezone);
      const localDate = new moment(utcDateStr); 
console.log('USER_TIMEZONE',localDate)
        return (
          <div
            key={utcDateStr}
            className="page-item"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              opacity: 0.9
            }}
            onClick={() => onSelectEntry(utcDateStr)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.opacity = '0.9';
            }}
          >
       
            <img
              src={PAGE_IMG}
              alt="Journal page"
              className="page-img"
              style={{
                width: '130px',
                height: '170px',
                objectFit: 'cover',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(62,44,28,0.4)',
                border: '4px solid var(--gold)'
              }}
            />
            <div
              className="page-date"
              style={{
                marginTop: '1rem',
                fontFamily: "'Crimson Text', serif",
                fontSize: '1.05rem',
                color: 'var(--ink)',
                fontWeight: '600'
              }}
            >
              {localDate.format('D MMMM YYYY')}
              <br />
              <small style={{ opacity: 0.8, fontWeight: 'normal' }}>
                {localDate.format('dddd')}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
}