
class todo {
    constructor(todoListArray, cookie = {}) {
        this.listData = this.defineListData(todoListArray);
        this.setting = this.defineSetting(cookie);

        this.category = this.defineCategory();
    }

    defineListData(todoListArray) {
        return todoListArray;
    }

    defineCategory() {
        const category = [
            { name: "all", text: "すべて" },
            { name: "daily", text: "日課" },
            { name: "ap", text: "AP" },
            { name: "exp", text: "経験値" },
            { name: "gold", text: "ゴールド" },
            { name: "adventure", text: "冒険家の印章" },
            { name: "belfast", text: "ベルファストの印章" },
        ];

        return category;
    }

    defineSetting() {

    }

    setCookie() {

    }

    getCategory() {
        return this.category;
    }

    makeHtml() {
        const viewHtml = (questsHtml) => {
            const categoryHtml = () => {
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
                + `        <ul class="nav nav-tabs">${categoryHtml()}</ul>${questsHtml}`
                + `    </div>`
                + `    <div class="card-footer p-1">`
                + `        <button class="btn btn-lg btn-primary w-100 reset">リセット</button>`
                + `    </div>`
                + `</div>`;

            return html;
        }

        const questHtml = (quest) => {
            const html = ``
                + `<div class="card todo mb-4">`
                + `    <div class="card-header p-1">`
                + `        <p class="float-left"><span class="badge badge-light">${quest.category}</span>　${quest.title}</p>`
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
            questsHtml += questHtml(e);
        }

        const html = viewHtml(questsHtml);

        return html;
    }
}


$(document).ready(function () {
    const path = "https://aaaanwz.github.io/mabi-daily-work/data/todo.json";
    let todoList = {};

    $.getJSON(path)
        .done(function (todoList) {
            const cookie = {};
            const t = new todo(todoList.todo, cookie);

            const html = t.makeHtml();
            $("#todolist").html(html);

            // ◆cardおりたたみ
            $(".toggle").on("click", function () {
                $(this).parent("div").next("div").toggle(200);
                if ($(this).text() == "□") {
                    $(this).text("＿");
                } else {
                    $(this).text("□");
                }
            });

            // ◆完了：カード非表示
            $(".complete").on("click", function () {
                $(this).parent("div").parent(".todo").hide(200);
            });

            // ◆リセット：カード再表示
            $(".reset").on("click", function () {
                $(".todo").show();
            });

            // ◆カテゴリ選択：
            $(".category").on("click", function () {
                const categoryList = t.getCategory();
                const selectedCategory = $(this).attr("category");

                if (selectedCategory === "all") {
                    $(".all").show();
                } else {
                    for (const e of categoryList) {
                        if (e.name === selectedCategory) {
                            $(`.${e.name}`).show();
                        } else {
                            $(`.${e.name}`).hide();
                        }
                    }
                }
            });

        })
        .fail(function () {
            const failHtml = `<div class="alert alert-danger" role="alert">ToDoリストデータの読み込みに失敗しました</div>`;
            $("#todolist").html(failHtml);
        })
        .always(function () {
        });
});