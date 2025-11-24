import { format } from 'date-fns';

export default function EntryViewer({ entry, onEdit, onClose }) {
  if (!entry) return null;

  const formatDate = (dateStr) => {
    return format(new Date(dateStr + 'T12:00:00'), "d MMMM yyyy • EEEE");
  };

  return (
    <div id="entryPopupOverlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      overflowY: 'auto'
    }} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      
      <div className="entry-popup" style={{
        background: 'var(--paper)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '95vh',
        overflowY: 'auto',
        borderRadius: '24px',
        padding: '4rem 3rem 3rem',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        border: '6px double var(--gold)',
        position: 'relative',
        fontFamily: "'Libre Baskerville', serif",
        lineHeight: '1.8',
        color: 'var(--ink)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '28px',
            background: 'none',
            border: 'none',
            fontSize: '3.2rem',
            fontWeight: '300',
            color: 'var(--ink)',
            opacity: 0.6,
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.6}
          title="Close"
        >
          ×
        </button>

        {/* Date & Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.6rem',
          margin: '0 0 1rem',
          color: 'var(--gold)',
          fontFamily: "'Playfair Display', serif"
        }}>
          {formatDate(entry.date)}
        </h2>

        <h3 style={{
          textAlign: 'center',
          fontSize: '2rem',
          margin: '0 0 2.5rem',
          fontWeight: 'normal',
          color: 'var(--ink)'
        }}>
          {entry.focus || '(Untitled Entry)'}
        </h3>

        {/* Edit Button */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button className="btn-nav" onClick={onEdit}>
            Edit This Entry
          </button>
        </div>

        {/* All Content Sections */}
        <div style={{ fontSize: '1.1rem' }}>

          {entry.didToday && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                A. What I Did Today
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.didToday }} />
            </section>
          )}

          {entry.wentWell && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                What Went Well
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.wentWell }} />
            </section>
          )}

          {entry.challenges && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Challenges / Frustrations
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.challenges }} />
            </section>
          )}

          {entry.learned && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                What I Learned
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.learned }} />
            </section>
          )}

          {entry.feelings && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                How I Felt Today
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.feelings }} />
            </section>
          )}

          {entry.triggers && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Triggers & How I Responded
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.triggers }} />
            </section>
          )}

          {entry.gratitude && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Three Things I’m Grateful For
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.gratitude }} />
            </section>
          )}

          {entry.proud && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                One Thing I’m Proud Of Today
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.proud }} />
            </section>
          )}

          {entry.tomorrow && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ color: 'var(--gold)', borderBottom: '2px solid var(--gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Tomorrow’s Focus
              </h4>
              <div dangerouslySetInnerHTML={{ __html: entry.tomorrow }} />
            </section>
          )}

          {entry.mantra && (
            <div style={{
              textAlign: 'center',
              margin: '3.5rem 0',
              padding: '2rem',
              background: 'rgba(184,155,106,0.12)',
              borderRadius: '16px',
              fontSize: '2.1rem',
              fontFamily: "'Playfair Display', serif",
              color: 'var(--gold)',
              fontStyle: 'italic'
            }}>
              “{entry.mantra}”
            </div>
          )}

          {entry.positiveThought && (
            <section style={{
              margin: '4rem 0 2rem',
              padding: '2.5rem',
              background: 'rgba(184,155,106,0.15)',
              borderRadius: '20px',
              textAlign: 'center',
              fontSize: '1.4rem',
              fontStyle: 'italic',
              border: '2px dashed var(--gold)'
            }}>
              <div dangerouslySetInnerHTML={{ __html: entry.positiveThought }} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}