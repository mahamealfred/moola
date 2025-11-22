'use client';

import { useTranslation } from '@/lib/i18n-context';

interface MessageFormProps {
  message: string;
  setMessage: (message: string) => void;
  senderId: string;
  setSenderId: (senderId: string) => void;
}

export default function MessageForm({ message, setMessage, senderId, setSenderId }: MessageFormProps) {
  const { t } = useTranslation();
  const messageCost = message.length > 160 ? 30 : 15;
  const charCount = message.length;

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white">{t('bulkSms.composeMessage')}</h2>
      <div className="space-y-3 md:space-y-4">
        <div>
          <label htmlFor="senderId" className="block mb-1 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
            {t('bulkSms.senderId')}
          </label>
          <input
            id="senderId"
            type="text"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            placeholder={t('bulkSms.senderIdPlaceholder')}
            className="w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] transition text-sm md:text-base"
            maxLength={11}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('bulkSms.senderIdHelp')}
          </p>
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
            {t('bulkSms.yourMessage')}
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('bulkSms.messagePlaceholder')}
            rows={6}
            className="w-full px-2.5 py-1.5 md:px-3 md:py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#ff6600] transition text-sm md:text-base resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${
              charCount > 160 ? 'text-[#ff6600]' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {charCount} {t('bulkSms.characters')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('bulkSms.costPerMessage')}: RWF {messageCost}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('bulkSms.messageHelp')}
          </p>
        </div>
      </div>
    </div>
  );
}