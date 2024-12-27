import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (data: {
    share_type: "public" | "private";
    permission: "view" | "download";
    expires_in_days: number;
    users?: string[];
  }) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [shareType, setShareType] = useState<"public" | "private">("public");
  const [permission, setPermission] = useState<"view" | "download">("view");
  const [expireDays, setExpireDays] = useState(7);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleAddEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleSubmit = () => {
    onShare({
      share_type: shareType,
      permission,
      expires_in_days: expireDays,
      ...(shareType === "private" && { users: emails }),
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-black font-semibold"
                >
                  Share File
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-black hover:text-black"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="mt-4 space-y-4">
                  {/* Share Type Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Share Type
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="public"
                          checked={shareType === "public"}
                          onChange={(e) =>
                            setShareType(e.target.value as "public" | "private")
                          }
                          className="form-radio"
                        />
                        <span className="ml-2 text-black">Public</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="private"
                          checked={shareType === "private"}
                          onChange={(e) =>
                            setShareType(e.target.value as "public" | "private")
                          }
                          className="form-radio"
                        />
                        <span className="ml-2 text-black ">Private</span>
                      </label>
                    </div>
                  </div>

                  {/* Permission Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      Permission
                    </label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="view"
                          checked={permission === "view"}
                          onChange={(e) =>
                            setPermission(e.target.value as "view" | "download")
                          }
                          className="form-radio"
                        />
                        <span className="ml-2 text-black">View Only</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="download"
                          checked={permission === "download"}
                          onChange={(e) =>
                            setPermission(e.target.value as "view" | "download")
                          }
                          className="form-radio"
                        />
                        <span className="ml-2 text-black">Download</span>
                      </label>
                    </div>
                  </div>

                  {/* Email Input for Private Sharing */}
                  {shareType === "private" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-black">
                        Share with Users
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="flex-1 rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="user@example.com"
                        />
                        <button
                          type="button"
                          onClick={handleAddEmail}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      {/* Email List */}
                      <div className="mt-2 space-y-2">
                        {emails.map((email) => (
                          <div
                            key={email}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                          >
                            <span className="text-sm text-black">{email}</span>
                            <button
                              onClick={() => handleRemoveEmail(email)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expiration Days */}
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Expire after (days)
                    </label>
                    <input
                      type="number"
                      value={expireDays}
                      onChange={(e) => setExpireDays(Number(e.target.value))}
                      min="1"
                      max="30"
                      className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={shareType === "private" && emails.length === 0}
                    className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                  >
                    Share
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
