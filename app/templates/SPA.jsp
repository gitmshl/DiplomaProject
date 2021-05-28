<%@ page import="com.mshl.Protocol_Handler.PH_Test" %>
<%@ page import="com.mshl.HASH_STORE.HST" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    Cookie[] cookies = request.getCookies();
    int id = -1;
    String uid = request.getSession().getId();
    if (cookies != null)
        for (Cookie cookie: cookies)
            if (cookie.getName().equals("ID"))
            {
                try
                {
                    id = Integer.parseInt(cookie.getValue());
                }
                catch (NumberFormatException e)
                {
                    id = -1;
                    break;
                }
            }
    if (id == -1 || !HST.exist(uid, id))
    {
%>
    <script>
        location.href = "/Messenger_war_exploded/login";
    </script>
<%
    }
    else
    {

%>


<!doctype html>
<html lang="ru-RU">
<head>
    <meta charset="UTF-8">
    <title>My Dialogs</title>
    <link rel="stylesheet" href="css/SPA/my_dialogs.css">
    <link rel="stylesheet" href="fonts/SPA/fonts.css">
    <link rel="stylesheet" href="fonts/SPA/rubik/rubik.css">
    <link rel="stylesheet" href="fonts/SPA/roboto_vk_font/roboto_vk_font.css">

    <script type="text/javascript" src="js/Sender/Sender.js"></script>
    <script type="text/javascript" src="js/SST/SST.js"></script>
    <script type="text/javascript" src="js/Consts/Consts.js"></script>
    <script type="text/javascript" src="js/UC/UC.js"></script>
    <script type="text/javascript" src="js/Timer/Timer.js"></script>
    <script type="text/javascript" src="js/ProtocolHandler/PH.js"></script>
    <script type="text/javascript" src="js/Painter/Painter.js"></script>

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/autoResize.js"></script>

    <script type="text/javascript">

        window.onload = function(){

            $("#textar").autoResize();

            SST.setUser(<%=id%>);

            var ws = new WebSocket("ws://localhost:8080/Messenger_war_exploded/tmessenger?UID=<%=uid%>&id=<%=id%>");

            Sender.setWs(ws);

            ws.onopen = function (){
                UC.start();
            }

            ws.onmessage = function(data){
                PH.handl(data.data);
            }

            ws.onclose = function() {
                console.log("closed");
            }

            ws.onerror = function(){
                console.log("error of connection");
            }

            /* Вешаем обработчик на нажатие кнопки отправки сообщения в диалоге */
            document.getElementById("textar").addEventListener("keydown", function(e){
                if (!e.shiftKey && e.key == "Enter"){
                    UC.req_10();
                }
            });
        }

    </script>

</head>
<body id="body" style="display: none;">
<header>
    <div class="header">
        <div class="subheader">
            <div class="logo"></div>
            <div class="search_block">
                <form action="">
                    <div class="search_field">
                        <input type="text" id="search_input" name="Global_Search_Line" class="placeholder_style" placeholder="Search...">
                        <input type="image" id="search_button" name = "Global_Search_Button" src="images/SPA/search_button.png" alt="Search">
                    </div>
                </form>
            </div>
            <div class="right_column">
                <div class="signOut_block">
                    <form action="">
                        <div class="signOut_a" onclick="UC.logout()">
                            <a class="right_top" href="" onclick="return false;">Sign out</a>
                        </div>
                    </form>
                </div>
                <div class="options_block">
                    <form action="">
                        <div class="options_a">
                            <a class="right_top" href="">Options</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</header>
<div class="clear"></div>
<div class="wrapper">
    <div class="leftSidebar">
        <ul class="left_sidebar_ul">
            <li>
                <div class="my_page" onclick="UC.goToDialogList();">
                    <a href="" onclick="return false;">
                        My page
                    </a>
                </div>
            </li>
            <li>
                <div class="my_friends">
                    <a href="..\Page\Friends\MFS.php">
                        My friends
                    </a>
                </div>
            </li>


            <li>
                <div class="my_messages">
                    <a href="DS.php" onclick="">
                        My dialogs
                    </a>
                </div>
            </li>
            <li>
                <div class="my_groups">
                    <a href="">
                        My groups
                    </a>
                </div>
            </li>
        </ul>
    </div>

    <div id="DialogList" style="display: none;">
        <div class="middle_content">
            <form action="">
                <div class="search_field_large">
                    <input type="text" id="search_input_large" name="DS_Line" class="placeholder_style" placeholder="Search...">
                    <input type="image" id="search_button_large" src="images/SPA/search_button.png" alt="Search">
                </div>
            </form>

            <div id="Dialogs">

            </div>

        </div>
    </div>

    <div id="Dialog" style="display: none;">
        <div class="middle_content_current_dialog">

            <div class="profile_block_current_dialog">
                <img src="img/user_8/mfB4lkFrPe0.jpg" class="profile_photo_current_dialog" alt="">
                <div class="profile_name_current_dialog">
                    <div class="sub1_current_dialog">
                        <a href="#" class="profile_name_link_current_dialog">MUSA</a>
                    </div>
                </div>
            </div>

            <div id="Messages">
                <%--<div class="dialog_history_current_dialog" id="message_id_1">--%>
                    <%--<div class="message_current_dialog">--%>
                        <%--<div id="photo_space">--%>
                            <%--<img src="img/mfB4lkFrPe0.jpg" alt="" id="avat">--%>
                            <%--<div class="hiddenUserName_current_dialog" style="display: none;">User Name</div>--%>
                            <%--<div class="hiddenUserId_current_dialog" style="display: none;">User Id</div>--%>
                        <%--</div>--%>
                        <%--<p class="date_current_dialog">04:06</p>--%>
                        <%--<p class="message_text_current_dialog">dfgdfgdfgdfgdfg</p>--%>
                    <%--</div>--%>
                <%--</div>--%>
            </div>
            <div class="typing_block_current_dialog">
                <textarea name="msg" id="textar" disabled="disabled"></textarea>
                <button type = "submit" name = "Send_msg_Button" id="send"></button>
            </div>
        </div>
    </div>

</div>
</body>
</html>

<%
    }
%>