import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']];
const fields = [
  'didToday', 'wentWell', 'challenges', 'learned',
  'feelings', 'triggers', 'gratitude', 'proud',
  'tomorrow', 'positiveThought'
];

export default function JournalEditor({ entry, onSave, onClose }) {
  const quillRefs = useRef({});
  const quillInstances = useRef({});

  useEffect(() => {
    fields.forEach((field) => {
      const container = quillRefs.current[field];
      if (container && !quillInstances.current[field]) {
        console.log('quil editor')
        quillInstances.current[field] = new Quill(container, {
          theme: 'snow',
          modules: { toolbar: toolbarOptions },
          placeholder: 'Start writing…',
        });
      }
      if (entry?.[field] && quillInstances.current[field]) {
        quillInstances.current[field].root.innerHTML = entry[field];
      }
    });

    return () => {
      Object.values(quillInstances.current).forEach(q => q?.destroy?.());
      quillInstances.current = {};
    };
  }, [entry?.date]);

  const handleSave = () => {
    const data = {
      date: entry.date,
      focus: document.getElementById('focus')?.value.trim() || '',
      mantra: document.getElementById('mantra')?.value.trim() || '',
      ...fields.reduce((acc, field) => {
        const quill = quillInstances.current[field];
        acc[field] = quill ? quill.root.innerHTML : '';
        return acc;
      }, {})
    };
    onSave(data);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
    }).replace(',', ' •');
  };

  return (
    <div className="journal-area" style={{ margin: '100px auto 0', maxWidth: '1000px', position: 'relative' }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '2.4rem',
          cursor: 'pointer',
          color: 'var(--ink)',
          opacity: 0.6,
          zIndex: 100,
          fontWeight: 'bold',
          lineHeight: 1
        }}
        onMouseEnter={(e) => e.target.style.opacity = 1}
        onMouseLeave={(e) => e.target.style.opacity = 0.6}
        title="Close editor"
      >
        ×
      </button>

      <div className="main-content" style={{ position: 'relative', paddingTop: '4rem' }}>
        <div className="date-display">{formatDate(entry.date)}</div>

        <label>Today’s Focus / Title</label>
        <input
          type="text"
          id="focus"
          defaultValue={entry?.focus || ''}
          placeholder="e.g., Decision Making, Confidence"
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1.4rem',
            border: 'none',
            borderBottom: '3px solid var(--gold)',
            background: 'transparent',
            marginBottom: '2rem'
          }}
        />

        {/* All your sections with Quill editors */}
        <div className="section"><h2>A. Daily Reflection</h2>
          <label>What I Did Today</label>
          <div ref={el => quillRefs.current.didToday = el} />
          <label>What Went Well</label>
          <div ref={el => quillRefs.current.wentWell = el} />
          <label>Challenges / Frustrations</label>
          <div ref={el => quillRefs.current.challenges = el} />
          <label>What I Learned</label>
          <div ref={el => quillRefs.current.learned = el} />
        </div>

        {/* ... other sections (B, C, D, etc.) exactly the same ... */}
        <div className="section"><h2>B. Emotional Check</h2>
          <label>How I Felt Today</label>
          <div ref={el => quillRefs.current.feelings = el} />
          <label>Triggers & How I Responded</label>
          <div ref={el => quillRefs.current.triggers = el} />
        </div>

        <div className="section"><h2>C. Gratitude & Pride</h2>
          <label>Three Things I’m Grateful For</label>
          <div ref={el => quillRefs.current.gratitude = el} />
          <label>One Thing I’m Proud Of Today</label>
          <div ref={el => quillRefs.current.proud = el} />
        </div>

        <div className="section"><h2>D. Forward Planning</h2>
          <label>Tomorrow’s Focus</label>
          <div ref={el => quillRefs.current.tomorrow = el} />
          <label>Mantra / Reminder</label>
          <input
            type="text"
            id="mantra"
            defaultValue={entry?.mantra || ''}
            className="mantra"
            placeholder="“Progress, not perfection.”"
            style={{
              fontSize: '1.8rem',
              textAlign: 'center',
              width: '100%',
              padding: '1.5rem',
              border: 'none',
              background: 'rgba(184,155,106,0.15)',
              borderRadius: '12px',
              margin: '1.5rem 0'
            }}
          />
        </div>

        <div className="section"><h2>Positive Thought for the Day</h2>
          <div ref={el => quillRefs.current.positiveThought = el} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-nav" onClick={handleSave} style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}