
class todo {
    constructor(id, todoListData, cookie = {}) {
        this.id = id;
        this.listData = this._setListData(todoListData);
        this.setting = this._setSetting(cookie);

        this.category = this._setCategory(todoListData);
    }

    error(title, text) {
        const html = `<div class="alert alert-danger" role="alert">${title} : ${text}</div>`;

        $(this.id).html(html);
    }

    _setCategory(todoListData) {
        if (Array.isArray(todoListData.category)) {
            return todoListData.category;
        }

        this.error("カテゴリ異常", "todo.json カテゴリ情報を読み込めませんでした");
    }

    _setListData(todoListData) {
        const modTodoData = (todoListData) => {
            let num = 0;
            for (let e of todoListData) {
                e.done = false;
                e.id = num;
                num++;
            }

            return todoListData;
        };

        if (Array.isArray(todoListData.todo)) {
            const moddedTodoListData = modTodoData(todoListData.todo);

            return moddedTodoListData;
        }

        this.error("データ異常", "todo.json 日課データを読み込めませんでした");
    }

    _setSetting() {

    }

    _setCookie() {

    }

    _makeQuestsHtml(category) {
        const isShow = (quest, category) => {
            const today = "sunday";

            if (quest.done === true) {
                return false;
            }

            if (today === today) {

            }

            if (category === "all") {
                return true;
            } else {
                if (quest.category.indexOf(category) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        const questHtml = (quest) => {
            const categoryPills = (category) => {
                let html = ``;
                for (const e of category) {
                    html += `<span class="badge badge-light mr-2">${e}</span>`;
                }

                return html;
            }

            const html = ``
                + `<div class="card todo mb-4" questNum=${quest.id}>`
                + `    <div class="card-header p-1">`
                + `        <p class="float-left">${categoryPills(quest.category)}　${quest.title}</p>`
                + `        <button type="button" class="btn btn-sm btn-secondary float-right complete" style="margin-left:5px;width:25px;">×</button>`
                + `    </div>`
                + `    <div class="card-body p-2">`
                + `        <p class="mb-2">${quest.subject}</p>`
                + `        ${(quest.caution) ? '<div class="alert alert-danger p-1 m-0" role="alert"><small>' + quest.caution + '</small></div>' : ''}`
                + `    </div>`
                + `    <div class="card-footer p-1">`
                + `        <small>場所：${quest.place}　NPC：${quest.npc}　報酬：${quest.rewards}</small>`
                + `        <button type="button" class="btn btn-sm btn-primary text-white font-weight-bold float-right complete">完了</button>`
                + `    </div>`
                + `</div>`;
            return html;
        };

        let questsHtml = ``;
        for (const e of this.listData) {
            if (isShow(e, category)) {
                questsHtml += questHtml(e);
            }
        }

        return questsHtml;
    }

    _makeViewHtml() {
        const categoryNavHtml = () => {
            let categoryHtml = ``;
            for (const e of this.category) {
                categoryHtml += `<li class="nav-item"><a class="nav-link category" href="#" category="${e.name}">${e.text}</a></li>`;
            }

            return categoryHtml;
        }

        const html = ``
            + `<div class="card todo mb-4">`
            + `    <div class="card-header p-1">`
            + `        <p class="float-left">デイリーワーク</p>`
            + `        <button type="button" class="btn btn-sm btn-secondary float-right toggle" style="margin-left:5px;width:25px;">_</button>`
            + `    </div>`
            + `    <div class="card-body p-2">`
            + `        <ul class="nav nav-tabs">${categoryNavHtml()}</ul><div id="quests"></div>`
            + `    </div>`
            + `    <div class="card-footer p-1">`
            + `        <button class="btn btn-lg btn-primary w-100 reset">リセット</button>`
            + `    </div>`
            + `</div>`;

        return html;
    }

    setDone(questId) {
        const num = Number(questId);
        this.listData[num].done = true;

        return this.listData;
    }

    setReset() {
        for (let e of this.listData) {
            e.done = false;
        }

        return this.listData;
    }

    reflesh(category = "all") {
        const that = this;
        const html = this._makeQuestsHtml(category);

        $("#quests").html(html);

        // ◆cardおりたたみ
        $(".toggle").unbind("click");
        $(".toggle").on("click", function () {
            $(this).parent("div").next("div").toggle(200);
            if ($(this).text() == "□") {
                $(this).text("＿");
            } else {
                $(this).text("□");
            }
        });

        // ◆完了：カード非表示
        $(".complete").unbind("click");
        $(".complete").on("click", function () {
            const questId = $(this).parent("div").parent(".todo").attr("questNum");
            that.setDone(questId);

            $(this).parent("div").parent(".todo").hide(200);
        });

        // ◆リセット：カード再表示
        $(".reset").unbind("click");
        $(".reset").on("click", function () {
            that.setReset();
            that.reflesh();
        });

        // ◆カテゴリ選択
        $(".category").unbind("click");
        $(".category").on("click", function () {
            const selectedCategory = $(this).attr("category");

            that.reflesh(selectedCategory);
        });
    }

    render() {
        const html = this._makeViewHtml();

        $(this.id).html(html);
        this.reflesh();
    }

}


$(document).ready(function () {
    const path = "https://aaaanwz.github.io/mabi-daily-work/data/todo.json";
    const id = "#todolist";

    $.getJSON(path)
        .done(function (todoList) {
            const cookie = {};
            const t = new todo(id, todoList, cookie);

            t.render();
        })
        .fail(function () {
            const failHtml = `<div class="alert alert-danger" role="alert">ToDoリストデータの読み込みに失敗しました</div>`;
            $(id).html(failHtml);
        })
        .always(function () {
        });
});