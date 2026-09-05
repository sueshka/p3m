import { useEffect, useState } from 'react';
import {
  broadcast,
  fetchAdminStats,
  type AdminStats,
  type BroadcastProgress,
} from '../lib/admin';
import { haptic } from '../lib/telegram';
import { color, font, radius, shadow } from '../styles/tokens';
import { Pressable } from '../components/Pressable';
import { PrimaryCTA } from '../components/PrimaryCTA';

/** One number with its label. */
function Stat({ value, label, tone }: { value: number | null; label: string; tone?: string }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: color.white,
        borderRadius: radius.lg,
        padding: '14px 12px',
        boxShadow: shadow.card,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: tone ?? color.ink,
          lineHeight: 1.1,
        }}
      >
        {value === null ? '—' : value.toLocaleString('ru-RU')}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 10.5,
          fontFamily: font.mono,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: color.faint,
        }}
      >
        {label}
      </div>
    </div>
  );
}

type SendState =
  | { phase: 'idle' }
  /** Two taps to send: there is no way to un-send a broadcast. */
  | { phase: 'confirming' }
  | { phase: 'sending'; progress: BroadcastProgress }
  | { phase: 'done'; progress: BroadcastProgress; error?: string };

export function AdminScreen() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [send, setSend] = useState<SendState>({ phase: 'idle' });

  const loadStats = () => {
    setLoading(true);
    fetchAdminStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  };

  useEffect(loadStats, []);

  const startSend = async () => {
    haptic('medium');
    setSend({ phase: 'sending', progress: { sent: 0, failed: 0, blocked: 0, total: 0 } });
    const result = await broadcast(text.trim(), (progress) =>
      setSend({ phase: 'sending', progress }),
    );
    const { error, ...progress } = result;
    setSend({ phase: 'done', progress, error });
    haptic(error ? 'light' : 'medium');
    // Blocked chats were pruned during the run, so the counts moved.
    loadStats();
  };

  const canSend = text.trim().length > 0 && send.phase !== 'sending';

  return (
    <div
      className="pc-scroll"
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        padding: `calc(18px + var(--pc-safe-top)) 16px calc(120px + var(--pc-safe-bottom))`,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          Админка
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: color.inkSoft }}>
          Видно только тебе. Сервер проверяет доступ отдельно.
        </p>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Статистика</h2>
          <Pressable
            onClick={() => {
              haptic('light');
              loadStats();
            }}
            style={{ fontSize: 12.5, fontWeight: 600, color: color.burgundy }}
          >
            Обновить
          </Pressable>
        </div>

        {loading && !stats ? (
          <p style={{ margin: 0, fontSize: 13, color: color.faint }}>Загружаю…</p>
        ) : !stats ? (
          <p style={{ margin: 0, fontSize: 13, color: color.burgundy }}>
            Не удалось загрузить. Проверь, что ADMIN_TELEGRAM_IDS задан на сервере.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Stat value={stats.chats} label="в боте" />
              <Stat value={stats.activeSubscriptions} label="подписок" tone={color.freeInk} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Stat value={stats.consents} label="согласий" />
              <Stat value={stats.expiredSubscriptions} label="истекло" />
              <Stat value={stats.dead} label="заблок." tone={color.faint} />
            </div>
          </div>
        )}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Рассылка</h2>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // Editing after a run clears the old result, so a stale
            // "отправлено" cannot be mistaken for this message's outcome.
            if (send.phase === 'done' || send.phase === 'confirming') setSend({ phase: 'idle' });
          }}
          placeholder="Текст сообщения…"
          rows={5}
          maxLength={4096}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            background: color.white,
            border: 'none',
            borderRadius: radius.lg,
            padding: 14,
            fontSize: 14.5,
            lineHeight: 1.45,
            fontFamily: font.sans,
            color: color.ink,
            boxShadow: shadow.card,
            outline: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: color.faint }}>
          <span>
            {stats ? `Получателей: ${stats.chats.toLocaleString('ru-RU')}` : ''}
          </span>
          <span>{text.length}/4096</span>
        </div>

        {send.phase === 'sending' && (
          <div style={{ fontSize: 13, color: color.inkSoft }}>
            Отправляю… {send.progress.sent}
            {send.progress.total ? ` из ${send.progress.total}` : ''}
          </div>
        )}

        {send.phase === 'done' && (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: send.error ? color.burgundy : color.freeInk,
            }}
          >
            {send.error
              ? `Остановлено: ${send.error}. Дошло: ${send.progress.sent}.`
              : `Отправлено: ${send.progress.sent}.`}
            {send.progress.blocked > 0 && ` Заблокировали: ${send.progress.blocked}.`}
            {send.progress.failed > 0 && ` Ошибок: ${send.progress.failed}.`}
          </div>
        )}

        {send.phase === 'confirming' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: color.burgundy, fontWeight: 600 }}>
              Отправить {stats?.chats ?? '—'} получателям? Отменить будет нельзя.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <PrimaryCTA
                label="Да, отправить"
                onClick={startSend}
                variant="burgundy"
                height={48}
                style={{ flex: '1 1 0' }}
              />
              <Pressable
                onClick={() => setSend({ phase: 'idle' })}
                style={{
                  flex: '0 0 auto',
                  padding: '0 20px',
                  height: 48,
                  borderRadius: radius.pill,
                  background: color.surfaceAlt,
                  fontSize: 14.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Отмена
              </Pressable>
            </div>
          </div>
        ) : (
          <PrimaryCTA
            label={send.phase === 'sending' ? 'Отправляю…' : 'Отправить всем'}
            onClick={() => canSend && setSend({ phase: 'confirming' })}
            variant="burgundy"
            height={52}
            style={{
              opacity: canSend ? 1 : 0.35,
              pointerEvents: canSend ? 'auto' : 'none',
              boxShadow: canSend ? undefined : 'none',
            }}
          />
        )}
      </section>
    </div>
  );
}
