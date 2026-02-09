const fs = require('fs');
const path = require('path');

const filePath = path.join('apps', 'main', 'app', 'profile', 'page.tsx');

function findBlockEnd(content, startIndex) {
    let openBraces = 0;
    let started = false;

    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '(') {
            if (!started) started = true;
            openBraces++;
        } else if (content[i] === ')') {
            openBraces--;
            if (started && openBraces === 0) {
                return i + 1; // Return index after closing brace
            }
        }
    }
    return -1;
}

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Imports
    const importsToAdd = `import WishlistGrid from "@/components/features/profile/WishlistGrid";
import ReportIssueModal from "@/components/features/user/ReportIssueModal";
import OrdersTab from "@/components/features/profile/OrdersTab";
import WalletTab from "@/components/features/profile/WalletTab";
import RewardsTab from "@/components/features/profile/RewardsTab";
import HistoryTab from "@/components/features/profile/HistoryTab";
import NotificationsTab from "@/components/features/profile/NotificationsTab";
import ReportsTab from "@/components/features/profile/ReportsTab";
import SupportTab from "@/components/features/profile/SupportTab";
import ConsultationChatModal from "@/components/features/profile/ConsultationChatModal";
import UserDisputeChatModal from "@/components/features/user/UserDisputeChatModal";`;

    // Find existing imports block to replace
    const importsStartMarker = 'import WishlistGrid';
    const importsEndMarker = 'import ReportIssueModal'; // from "@/components/features/user/ReportIssueModal";

    // We can just find the range covering these imports
    const importStartIdx = content.indexOf(importsStartMarker);
    const importEndIdx = content.indexOf('";', content.indexOf(importsEndMarker)) + 2; // End of ReportIssueModal import

    if (importStartIdx !== -1 && importEndIdx !== -1) {
        content = content.substring(0, importStartIdx) + importsToAdd + content.substring(importEndIdx);
        console.log('Imports added.');
    } else {
        console.log('Could not find imports to replace. Check file content.');
    }

    // Helper for block replacement
    const processBlock = (marker, replacementName, replacementCode) => {
        const markerIdx = content.indexOf(marker);
        if (markerIdx === -1) {
            console.log(`Block not found: ${marker}`);
            return;
        }

        // Find the end of the block: { condition && ( ... ) }
        // The marker is inside the { ... }. 
        // Wait, marker I use is e.g. 'activeTab === "wallet" && ('
        // So the block starts *before* the marker?
        // No, standard is {activeTab ... }

        // Let's use finding the ) that closes the condition.
        const endIdx = findBlockEnd(content, markerIdx);
        if (endIdx === -1) {
            console.log(`Could not find end of block for ${marker}`);
            return;
        }

        // The marker starts at `activeTab...`. The surrounding braces are `{ ... }`.
        // The `findBlockEnd` starts counting at markerIdx.
        // marker: `activeTab === "wallet" && (`
        // It sees `(`. openBraces = 1. Matches till `)`.
        // So it finds the end of the `(` ... `)` block.
        // But the React interpolation is `{ ... }`.
        // So we need to encompass the outer `{ }`.

        // Actually, `content.substring(markerIdx, endIdx)` will capture `activeTab === "wallet" && ( ... )`.
        // The outer `{ ` and ` }` are around it.
        // e.g. `{activeTab === "wallet" && (...)}`

        // So if I replace `activeTab === "wallet" && (... )` with replacement code (which includes the condition or not?)
        // My replacement code assumes it's inside `{ }`.
        // Wait, my replacement code *is* `{cond && ( <Comp /> )}`.
        // So I should replace from `{activeTab...` to `}`.

        // Let's search for `{` before marker.
        let startBlockIdx = content.lastIndexOf('{', markerIdx);

        // And find matching `}` for *that* opening brace.
        // But `findBlockEnd` logic above is for `(` `)`. I need general brace matcher.

        // Simplified: Just match the `startMarker` (e.g. `{activeTab === "wallet" && (`)
        // And find closing `}`? No, closing `) }`.

        // Let's use `marker` = `{activeTab === "wallet" && (`
        // and replace until the closing `)}`.

        // Re-implement findBlockEnd for general braces?
        // It is safer to find the matching `)` for the `(` inside the marker.
        // The marker is `{activeTab === "wallet" && (`.
        // It has `(`.
        // Find matching `)`. That takes us to end of content.
        // Then next char should be `}`.

        const openParenIdx = content.indexOf('(', markerIdx);
        const closeParenIdx = findCorrectClosingParen(content, openParenIdx);

        if (closeParenIdx === -1) {
            console.log('Could not find closing paren');
            return;
        }

        // The full block to replace is `{ ... )}` (inclusive)
        const blockStart = content.lastIndexOf('{', markerIdx);
        const blockEnd = closeParenIdx + 2; // +1 for ), +1 for } (assuming immediately followed)

        // Verify blockEnd char is }
        // content[closeParenIdx] is ')'.
        // content[closeParenIdx+1] is '}'.
        // Wait, spacing? `)}` yes.

        // Replace!
        content = content.substring(0, blockStart) + replacementCode + content.substring(blockEnd);
        console.log(`Replaced ${replacementName}`);
    };

    const findCorrectClosingParen = (text, openPos) => {
        let balance = 0;
        for (let i = openPos; i < text.length; i++) {
            if (text[i] === '(') balance++;
            else if (text[i] === ')') {
                balance--;
                if (balance === 0) return i;
            }
        }
        return -1;
    };

    // Define replacements
    const replacements = [
        {
            marker: 'activeTab === "wallet" && (',
            name: 'WalletTab',
            code: `            {activeTab === "wallet" && (
              <WalletTab
                walletBalance={clientBalance || 0}
                walletView={walletView}
                setWalletView={setWalletView}
                rechargeAmount={rechargeAmount}
                setRechargeAmount={setRechargeAmount}
                handleRecharge={handleRecharge}
                isProcessing={isProcessing}
                rechargeOptions={rechargeOptions}
                transactions={walletTransactions}
                loadingTransactions={loadingTransactions}
                walletPurpose={walletPurpose}
                setWalletPurpose={setWalletPurpose}
              />
            )}`
        },
        {
            marker: 'activeTab === "rewards" && (',
            name: 'RewardsTab',
            code: `            {activeTab === "rewards" && (
              <RewardsTab
                loadingRewards={loadingRewards}
                rewards={rewards}
              />
            )}`
        },
        {
            marker: 'activeTab === "history" && (',
            name: 'HistoryTab',
            code: `            {activeTab === "history" && (
              <HistoryTab
                loadingHistory={loadingHistory}
                consultationHistory={consultationHistory}
                onViewDetails={handleViewChat}
                onReportIssue={(session) => {
                  setReportItemType('consultation');
                  setReportItemDetails(session);
                  setReportModalOpen(true);
                }}
              />
            )}`
        },
        {
            marker: 'activeTab === "orders" && (',
            name: 'OrdersTab',
            code: `            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                loadingOrders={loadingOrders}
                expandedOrders={expandedOrders}
                toggleOrder={toggleOrder}
                orderDisputes={orderDisputes}
                onViewChat={(dispute) => {
                  setSelectedDispute(dispute);
                  setShowDisputeChat(true);
                }}
                onReportIssue={(order) => {
                  setReportItemType('order');
                  setReportItemDetails(order);
                  setReportModalOpen(true);
                }}
                userPhone={clientUser?.phone}
                userName={clientUser?.name}
              />
            )}`
        },
        {
            marker: 'activeTab === "reports" && (',
            name: 'ReportsTab',
            code: `            {activeTab === "reports" && (
              <ReportsTab />
            )}`
        },
        {
            marker: 'activeTab === "notifications" && (',
            name: 'NotificationsTab',
            code: `            {activeTab === "notifications" && (
              <NotificationsTab
                loadingNotifications={loadingNotifications}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAllNotifs}
              />
            )}`
        },
        {
            marker: 'activeTab === "support" && (',
            name: 'SupportTab',
            code: `            {activeTab === "support" && (
              <SupportTab supportSettings={supportSettings} />
            )}`
        },
        {
            marker: 'showChatModal && selectedSession && (',
            name: 'ConsultationChatModal',
            code: `        {/* Chat History Modal */}
        <ConsultationChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          selectedSession={selectedSession}
          chatMessages={chatMessages}
          userAvatar={profileData?.profile_picture}
        />`
        }
    ];

    replacements.forEach(r => processBlock(r.marker, r.name, r.code));

    fs.writeFileSync(filePath, content);
    console.log('Refactoring complete.');

} catch (err) {
    console.error(err);
}
