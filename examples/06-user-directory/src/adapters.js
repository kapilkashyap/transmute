// Adapter boundary: keeps transmute model instances out of the network/api layer.
function toUserModel(raw) {
    return window.UD.createUserModel(raw);
}

function fromUserModel(model) {
    return model.toJson();
}

window.UD = window.UD || {};
window.UD.toUserModel = toUserModel;
window.UD.fromUserModel = fromUserModel;
