import { usePage } from './inertia';
import { getDayJsInstance } from '@/packages/ui/src/utils/time';

export function isBillingActivated() {
    const page = usePage();
    return page.props.has_billing_extension;
}

export function isInTrial() {
    const page = usePage();
    return page.props.billing.has_trial;
}

export function daysLeftInTrial() {
    const page = usePage();
    return (
        getDayJsInstance()(page.props.billing.trial_until).diff(
            getDayJsInstance()(),
            'days'
        ) + 1
    );
}

export function isBlocked() {
    const page = usePage();
    return page.props.billing.is_blocked;
}

export function isFreePlan() {
    return !hasActiveSubscription() && !isInTrial();
}

export function hasActiveSubscription() {
    const page = usePage();
    return page.props.billing.has_subscription;
}

export function isAllowedToPerformPremiumAction() {
    return (
        !isBillingActivated() ||
        (isBillingActivated() && hasActiveSubscription()) ||
        (isBillingActivated() && isInTrial())
    );
}
