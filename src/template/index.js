import { div, span } from '@/core/elements';
import SuspensionButton from './suspension-button.js';


export default function Template({
    SuspensionButtonClick = () => {},
}) {

    return div({
        className: 'imchat_body',
        children: [
            SuspensionButton({
                onClick: SuspensionButtonClick,
            }),
        ],
    })
}