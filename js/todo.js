

function renderTodoList(listdata) {
    let html = "";

    for (e of listdata) {
        html += ``
            + `<div class="card todo mb-4">`
            + `    <div class="card-header p-1">`
            + `        <p class="float-left"><span class="badge badge-light">${e.category}</span>　${e.title}</p>`
            + `        <button type="button" class="btn btn-sm btn-secondary float-right complete" style="margin-left:5px;width:25px;">×</button>`
            + `        <button type="button" class="btn btn-sm btn-secondary float-right toggle" style="margin-left:5px;width:25px;">_</button>`
            + `    </div>`
            + `    <div class="card-body p-2">`
            + `        <p class="mb-2">${e.subject}</p>`
            + `        ${(e.caution) ? '<div class="alert alert-danger p-1 m-0" role="alert"><small>' + e.caution + '</small></div>' : ''}`
            + `    </div>`
            + `    <div class="card-footer p-1">`
            + `        <small>場所：${e.place}　NPC：${e.place}　報酬：${e.rewards}</small>`
            + `        <button type="button" class="btn btn-sm btn-primary text-white font-weight-bold float-right complete">完了</button>`
            + `    </div>`
            + `</div>`;
    }

    const resetButton = `<button class="btn btn-lg btn-primary w-100 reset">リセット</button>`;
    html += resetButton;

    return html;
}

$(document).ready(function () {

    // ◆ToDoリスト
    const path = "https://aaaanwz.github.io/mabi-daily-work/data/todo.json";
    let todoList = {};

    $.getJSON(path)
        .done(function (json) {
            todoList = json;
        })
        .fail(function () {
            todoList = {
                "todo": [
                    {
                        "routine": "all",
                        "category": "戦闘",
                        "title": "読込異常",
                        "subject": "JSONよみこみにしっぱい",
                        "place": "Error",
                        "npc": "Error",
                        "rewards": "Error"
                    }
                ]
            }
        })
        .always(function () {
            const listhtml = renderTodoList(todoList.todo);
            $("#todolist").html(listhtml);

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

        });
});