from typing import Any

from app.services import firestore_users


class _Snap:
    def __init__(self, exists: bool, data: dict[str, Any] | None = None) -> None:
        self.exists = exists
        self._data = data or {}

    def to_dict(self) -> dict[str, Any]:
        return dict(self._data)


class _Ref:
    def __init__(self) -> None:
        self.payload: dict[str, Any] = {}
        self.created = False

    def get(self) -> _Snap:
        return _Snap(self.created, self.payload)

    def set(self, payload: dict[str, Any], merge: bool = False) -> None:
        if merge:
            self.payload.update(payload)
        else:
            self.payload = dict(payload)
        self.created = True


class _Collection:
    def __init__(self, ref: _Ref) -> None:
        self._ref = ref

    def document(self, _uid: str) -> _Ref:
        return self._ref


class _FakeDb:
    def __init__(self, ref: _Ref) -> None:
        self._ref = ref

    def collection(self, name: str) -> _Collection:
        assert name == firestore_users.USERS_COLLECTION
        return _Collection(self._ref)


def test_upsert_user_profile_strips_empty_fields(monkeypatch: Any) -> None:
    ref = _Ref()
    monkeypatch.setattr(
        firestore_users,
        "get_firestore_client",
        lambda: _FakeDb(ref),
    )
    saved = firestore_users.upsert_user_profile(
        uid="uid-1",
        email="user@example.com",
        role="homeowner",
        display_name="Jane",
        profile={"phone": "555-0100", "notes": "  ", "skip": None},
    )
    assert saved["uid"] == "uid-1"
    assert saved["role"] == "homeowner"
    assert saved["profile"] == {"phone": "555-0100"}
    assert ref.payload["account_type"] == "homeowner"
    assert "created_at" in ref.payload


def test_get_user_profile_missing(monkeypatch: Any) -> None:
    ref = _Ref()
    monkeypatch.setattr(
        firestore_users,
        "get_firestore_client",
        lambda: _FakeDb(ref),
    )
    assert firestore_users.get_user_profile("missing") is None
