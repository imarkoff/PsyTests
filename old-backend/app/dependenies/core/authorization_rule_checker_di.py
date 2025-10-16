from app.core.authorization_rule_checker import AuthorizationRuleChecker, AuthorizationRuleCheckerImpl


def get_authorization_rule_checker() -> AuthorizationRuleChecker:
    return AuthorizationRuleCheckerImpl()