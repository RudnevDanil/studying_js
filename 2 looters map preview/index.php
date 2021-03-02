<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Looters Map preview</title>
        <meta name="description" content="Looters Map preview">
        <meta name="author" content="RudnevDanil">
        <link rel="stylesheet" href="css/styles.css?v=1.0">
    </head>

    <body>
        <div id="header"><div class="content textHF" id="headerContent"><div class="textCenter">Looters Map</div></div></div>

        <div id="menu"><div class="content" id="menuSize">
            <ul class="menu">
                <li id="menuAuth" onclick="menuClicked(7)">AUTH</li>
                <li id="menuMap" onclick="menuClicked(1)">MAP</li>
                <li id="menuCameras" onclick="menuClicked(2)">CAMERAS</li>
                <li id="menuCameraSettings" onclick="menuClicked(3)">CAMERA SETTINGS</li>
                <li id="menuAboutProject" onclick="menuClicked(4)">ABOUT PROJECT</li>
                <li id="menuFaces" onclick="menuClicked(5)">FACES</li>
                <li id="menuStaff" onclick="menuClicked(6)">STAFF</li>
            </ul>
        </div></div>

        <div id="blackboard"><div class="content" id="blackboardSize">

            <!-- ------------------------------------ authScreen ------------------------------------------------ -->
            <div id="authScreen">
                <div class="topLine" id="topLineForAuthText"><div class="text authText">Authorization</div></div>
                <div class="topLine"><div class="text authText redAuthErr" id="authErrText"> </div></div>
                <div class="topLine"><input class="inputVal" id="authInputLogin" type="text" placeholder="login"><input class="inputVal" id="authInputPass" type="text" placeholder="password"></div>
                <div class="topLine" id="topLineForNewUser"><div class="text" id="authNewUser">New user ?</div><div class="butBackground butBackgroundBigSize notChecked" id="authNewUserButt" onclick="newUserClicked()"><img src='./data/poo_surprise.png' alt='newUser' class='imgTopLine butImgBigSize'></div></div>
                <div class="topLine topLineForImg"></div>
                <div></div>
                <div class="topLine topLineForImg"><div class="butBackground butBackgroundBigSize" id="authTry" onclick="authFunct.submitClicked()"><img src='./data/checked.png' alt='tryAuth' class='imgTopLine butImgBigSize' id="authTryButtImg"></div></div>
            </div>
            <!-- ------------------------------------ mapScreen ------------------------------------------------ -->
            <div id="mapScreen">

                <div class="topLine topLineForImg" id="mapScreenEdit"><div class="butBackground butBackgroundBigSize notChecked" id="mapScreenEditBackground" onclick="actions_map.editClicked()"><img src='./data/pencil_2.png' alt='edit' class='tooBigImg'></div></div>
                <div class="topLine topLineForImg" id="mapScreenSave"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenSaveBackground" onclick="actions_map.saveClicked()"><img src='./data/save.png' alt='last' class='tooBigImg'></div></div>

                <div class="topLine topLineForImg" id="mapScreenToolWall"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenToolWallBackground" onclick="actions_map.wallClicked()"><img src='./data/wall.png' alt='last' class='tooBigImg'></div></div>
                <div class="topLine topLineForImg" id="mapScreenToolCam"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenToolCamBackground" onclick="actions_map.cameraClicked()"><img src='./data/camera.png' alt='last' class='tooBigImg'></div></div>
                <div class="topLine topLineForImg" id="mapScreenToolDoor"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenToolDoorBackground" onclick="actions_map.doorClicked()"><img src='./data/door_2.png' alt='last' class='tooBigImg'></div></div>
                <div class="topLine topLineForImg" id="mapScreenToolWindow"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenToolWindowBackground" onclick="actions_map.windowsillClicked()"><img src='./data/windowsill.png' alt='last' class='tooBigImg'></div></div>

                <div class="topLine topLineForImg" id="mapScreenHand"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenHandBackground" onclick="actions_map.handClicked()"><img src='./data/pickUpHand.png' alt='last' class='tooBigImg'></div></div>
                <div class="topLine topLineForImg" id="mapScreenRemove"><div class="butBackground butBackgroundBigSize notChecked notAllowedToTouch" id="mapScreenRemoveBackground" onclick="actions_map.removeClicked()"><img src='./data/remove_img.png' alt='last' class='tooBigImg'></div></div>

                <div class="sliderBlock notAllowedToTouch hidden" id="wallSliders">
                    <div class="slider sliderPosition_1" id="slider_1"><div class="sliderLine" id="sliderLine_1"></div><div class="sliderDescription">Width</div><div class="sliderBall" id="ball_1"></div></div>
                    <div class="slider sliderPosition_2" id="slider_2"><div class="sliderLine" id="sliderLine_2"></div><div class="sliderDescription">Height</div><div class="sliderBall" id="ball_2"></div></div>
                    <div class="slider sliderPosition_3" id="slider_3"><div class="sliderLine" id="sliderLine_3"></div><div class="sliderDescription">Rotation</div><div class="sliderBall" id="ball_3"></div></div>
                </div>

                <div class="sliderBlock slidersBackground background"></div>

                <div class="sliderBlock notAllowedToTouch hidden" id="cameraSliders">
                    <div class="cameraChoice">
                        <select id="mapCameraChoice">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                    </div>

                    <div class="slider sliderPosition_2" id="slider_4"><div class="sliderLine" id="sliderLine_4"></div><div class="sliderDescription">Distance</div><div class="sliderBall" id="ball_4"></div></div>
                    <div class="slider sliderPosition_3" id="slider_5"><div class="sliderLine" id="sliderLine_5"></div><div class="sliderDescription">Rotation</div><div class="sliderBall" id="ball_5"></div></div>
                </div>
                <div class="mapPage mapPageViewMode" id="mapPage"><canvas id="map"></canvas></div>
            </div>

            <!-- ------------------------------------ camerasScreen ------------------------------------------------ -->
            <div id="camerasScreen">
                <div class="topLine topLineForImg" id="cameraScreenAmount_1"><div class="butBackground butBackgroundBigSize"><img src='./data/number_1_v2.png' alt='1' class='imgTopLine butImgBigSize tooSmallImg' onclick="switchDisplayAmountCamerasTo_1()"></div></div>
                <div class="topLine topLineForImg" id="cameraScreenAmount_2"><div class="butBackground butBackgroundBigSize"><img src='./data/number_2_v2.png' alt='1' class='imgTopLine butImgBigSize tooSmallImg' onclick="switchDisplayAmountCamerasTo_2()"></div></div>
                <div class="topLine topLineForImg" id="cameraScreenAmount_4"><div class="butBackground butBackgroundBigSize"><img src='./data/number_4_v2.png' alt='1' class='imgTopLine butImgBigSize tooSmallImg' onclick="switchDisplayAmountCamerasTo_4()"></div></div>


                <div class="cameraBlocks">
                    <div class="cameraBlock amountCameras_4" id="cameraBlock_1"><div class="testInside_2_4" id="placeholder_1"></div></div>
                    <div class="cameraBlock amountCameras_4" id="cameraBlock_2"><div class="testInside_2_4" id="placeholder_2"></div></div>
                    <div id="newLineForAmount_4"></div>
                    <div class="cameraBlock amountCameras_4" id="cameraBlock_3"><div class="testInside_2_4" id="placeholder_3"></div></div>
                    <div class="cameraBlock amountCameras_4" id="cameraBlock_4"><div class="testInside_2_4" id="placeholder_4"></div></div>
                </div>
            </div>

            <!-- ------------------------------------ cameraSettingsScreen ------------------------------------------------ -->
            <div id="cameraSettingsScreen">
                <div class="topLine topLineForImg" id="cameraSettingsUniversal"><div class="butBackground butBackgroundBigSize butNoFrame" id="CamSetUniSetBut"><img src='./data/plug.png' alt='universal' class='imgTopLine butImgBigSize imgNoFrame' id="CamSetUniSetImg" onclick="switchDisplayToUniSet()"></div></div>
                <div class="topLine topLineForImg" id="cameraSettingsStream"><div class="butBackground butBackgroundBigSize butNoFrame" id="CamSetStreamSetBut"><img src='./data/settings.png' alt='stream' class='imgTopLine butImgBigSize imgNoFrame' id="CamSetStreamSetImg" onclick="switchDisplayToStreamSet()"></div></div>
                <div class="topLine topLineForImg" id="cameraSettingsStream"><div class="butBackground butBackgroundBigSize butNoFrame" id="CamSetSaveBut"><img src='./data/save.png' alt='save' class='imgTopLine butImgBigSize imgNoFrame' id="CamSetSaveImg" onclick="saveCamSettings()"></div></div>
                <div class="settingsBackground"></div>

                <div id="uniSet">
                    <div class="topLine"><div class="text">Amount of cameras:<input class="inputVal" id="uniSetAmountOfCam" type="text"placeholder="1...16" onchange="amountOfCamChanged()"></div></div>
                </div>

                <div id="streamSet">
                    <div class="settingsBackground"></div>
                    <div id="streamSetFirstPage">

                        <div class="topLine"><div class="text streamSetPage1Text">Camera number</div>
                            <select class="choiceVal" id="streamSetCamNumb" onchange="camSettingsStreamChanged(0)"></select>
                        </div>
                        <div class="topLine"><div class="text streamSetPage1Text">Description</div><input class="inputVal"  id="streamSetDescription" type="text"placeholder="..." onchange="camSettingsStreamChanged(1)"></div>
                        <div class="topLine"><div class="text streamSetPage1Text">Connecting line</div><input class="inputVal"  id="streamSetConnectingLine" type="text"placeholder="..." onchange="camSettingsStreamChanged(2)"></div>

                        <div class="topLine topLineForButBig topLineNextBut" id="camSetNextButt"><div class="butBackground butBackgroundBigSize"><img src='./data/arrow_forward.png' alt='>' class='imgTopLine butImgBigSize' onclick="switchDisplaySettingsToNextPage()"></div></div>
                        <div class="topLine topLineForButBig topLineNextButPlaceholder" id="camSetNextButtPlaceHolder"><div class="button nextButtPlaceHolder" id="camSetNextButtBackground"></div></div>

                    </div>
                    <div id="streamSetSecondPage">
                        <div class="topLine"><div class="text streamSetPage2Text">Saving skip frames</div><input class="inputVal"  id="streamSetSavingSkipFrames" type="text"placeholder="..." onchange="camSettingsStreamChanged(3)"></div>
                        <div class="topLine"><div class="text streamSetPage2Text">Classification skip frames</div><input class="inputVal"  id="streamSetClassificationSkipFrames" type="text" placeholder="..." onchange="camSettingsStreamChanged(4)"></div>
                        <div class="topLine"><div class="text streamSetPage2Text">Cam FPS</div><input class="inputVal"  id="streamSetFPS" type="text"placeholder="..." onchange="camSettingsStreamChanged(5)"></div>
                        <div class="topLine"><div class="text streamSetPage2Text">Frames in one video</div><input class="inputVal"  id="streamSetFramesInOneVideo" type="text"placeholder="..." onchange="camSettingsStreamChanged(6)"></div>
                        <div class="topLine"><div class="text streamSetPage2Text">Scaling</div><input class="inputVal"  id="streamSetScaling" type="text"placeholder="..." onchange="camSettingsStreamChanged(7)"></div>

                        <div class="topLine topLineForButBig topLinePrevBut" id="camSetPrevButt"><div class="butBackground butBackgroundBigSize"><img src='./data/arrow_back.png' alt='<' class='imgTopLine butImgBigSize' onclick="switchDisplaySettingsToPrevPage()"></div></div>
                        <div class="topLine topLineForButBig topLinePrevButPlaceholder" id="camSetPrevButtPlaceHolder"><div class="button prevButtPlaceHolder" id="camSetPrevButtBackground"></div></div>
                    </div>
                </div>
            </div>

            <!-- ------------------------------------ aboutProjectScreen ------------------------------------------------ -->
            <div id="aboutProjectScreen">
                <div id="aboutProjectText">This project uses connected IP cameras to mark employees visits to premises, as well as to signal unauthorized visitors.</div>
            </div>

            <!-- ------------------------------------ facesScreen ------------------------------------------------ -->
            <div id="facesScreen">
                <div class="topLine topLineForImg" id="facesScreenRefresh"><div class="butBackground butBackgroundBigSize" onclick="facesRefreshClicked()"><img src='./data/refresh.png' alt='refresh' class='imgTopLine butImgBigSize'></div></div>
                <div class="topLine topLineForImg" id="facesScreenLast"><div class="butBackground butBackgroundBigSize"><img src='./data/speedometr.png' alt='last' class='imgTopLine butImgBigSize'></div></div>

                <div class="topLine topLineForDate" id="facesScreenDate_1"><input type="date" name="calendar"></div>
                <div class="topLine topLineForDate" id="facesScreenDate_2"><input type="date" name="calendar"></div>

                <div class="topLine topLineForImg" id="facesScreenArrowForward"><div class="butBackground butBackgroundBigSize"><img src='./data/arrow_forward.png' alt='search' class='imgTopLine butImgBigSize'></div></div>

                <div class="topLine topLineForSelect topLineForChoiceVal" id="facesScreenChoiceVal">
                    <select class="choiceVal" id="choiceValFacesScreen">
                        <optgroup label="Marketing dept">
                            <option>Gates M</option>
                            <option>Ford G</option>
                            <option>Trump D</option>
                        </optgroup>
                        <optgroup label="IT dept">
                            <option>Lane J</option>
                            <option>Richardson M</option>
                            <option>Obama B</option>
                        </optgroup>
                    </select>
                </div>
                <div class="topLine topLineForSelect topLineForChoiceVal" id="facesScreenChoiceValBackground"><select class="choiceVal" id="choiceValFacesScreenBackground"></select></div>

                <div class="topLine topLineForImg" id="facesScreenArrowOutR"><div class="butBackground butBackgroundBigSize"  onclick="facesAddToStaffClicked()"><img src='./data/arrow_out_right.png' alt='add_to_staff' class='imgTopLine butImgBigSize'></div></div>
                <div class="topLine topLineForImg" id="facesScreenPoo"><div class="butBackground butBackgroundBigSize"  onclick="facesAddToBannedClicked()"><img src='./data/poo.png' alt='make_bad_man' class='imgTopLine butImgBigSize'></div></div>
                <div class="topLine topLineForImg" id="facesScreenRemove"><div class="butBackground butBackgroundBigSize butNoFrame allowedToTouch"  id="butFacesRemove" onclick="facesRemoveClicked()"><img src='./data/x.png' alt='remove' class='imgTopLine butImgBigSize imgNoFrame' id="imgFacesRemove"></div></div>

                <div class="staffPage" id="facesPage">
                    <div class="topLine topLineForButBig topLinePrevBut" id="facesPrevButt"><div class="butBackground butBackgroundBigSize" onclick="facesPrevPage()"><img src='./data/arrow_back.png' alt='<' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLineForButBig topLinePrevButPlaceholder" id="facesPrevButtPlaceHolder"><div class="button prevButtPlaceHolder" id="facesPrevButtBackground"></div></div>
                    <div class="topLine" id="facesLoading"> Loading ...</div>
                    <div class="topLine" id="facesLoadingBackground"><div id="facesLoadingBackgroundInner"></div></div>
                    <div class="topLine topLineForButBig topLineNextBut" id="facesNextButt"><div class="butBackground butBackgroundBigSize" onclick="facesNextPage()"><img src='./data/arrow_forward.png' alt='>' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLineForButBig topLineNextButPlaceholder" id="facesNextButtPlaceHolder"><div class="button nextButtPlaceHolder" id="facesNextButtBackground"></div></div>
                </div>

            </div>

            <!-- ------------------------------------ staffScreen ------------------------------------------------ -->
            <div id="staffScreen">

                <div class="topLine topLineForImg" id="staffScreenLoupe"><div class="butBackground butBackgroundBigSize"><img src='./data/loupe.png' alt='plus' class='imgTopLine butImgBigSize' onclick="actions_staff.listShow()"></div></div>
                <div class="topLine topLineForImg" id="staffScreenPlus"><div class="butBackground butBackgroundBigSize"><img src='./data/plus.png' alt='plus' class='imgTopLine butImgBigSize' onclick="actions_staff.addShow()"></div></div>
                <div class="topLine topLineForSelect topLineForChoiceVal" id="staffScreenChoiceVal">
                    <select class="choiceVal" id="staffScreenSelect">
                        <option>loading ...</option>
                    </select>
                </div>

                <div class="staffPage" id="staffBackground"></div>

                <div class="staffPage" id="staffAddPage">
                    <div class="topLine topLinePrevBut" id="staffAddPrevButt"><div class="butBackground butBackgroundBigSize" onclick="staffAddPrevPage()"><img src='./data/arrow_back.png' alt='<' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLinePrevButPlaceholder" id="staffAddPrevButtPlaceHolder"><div class="button prevButtPlaceHolder" id="staffAddPrevButtBackground"></div></div>
                    <div class="topLine topLineNextBut" id="staffAddNextButt"><div class="butBackground butBackgroundBigSize" onclick="staffAddNextPage()"><img src='./data/arrow_forward.png' alt='>' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLineNextButPlaceholder" id="staffAddNextButtPlaceHolder"><div class="button nextButtPlaceHolder" id="staffAddNextButtBackground"></div></div>

                    <div class="topLine" id="staffAddFullNameBlock"><div class="text staffAddPageText">Full name</div><input class="inputVal staffInputVal"  id="staffAddPageName" type="text" placeholder="..."></div>
                    <div class="topLine"><div class="text staffAddPageText">Position</div><input class="inputVal staffInputVal"  id="staffAddPagePosition" type="text" placeholder="..."></div>

                    <div class="topLine topLineForButBig" id="staffAddSaveButt"><div class='butBackground butBackgroundBigSize butNoFrame' onclick="saveNewPerson()" id="butSaveNewPerson"><img src='./data/save.png' alt='save' class='imgTopLine butImgBigSize imgNoFrame'  id="imgSaveNewPerson"></div></div>
                    <div class="topLine topLineForButBig" id="staffAddRemoveUserButt"><div class='butBackground butBackgroundBigSize butNoFrame' onclick="removePerson()" id="butRemovePerson"><img src='./data/x.png' alt='remove' class='imgTopLine butImgBigSize imgNoFrame'  id="imgDeletePerson"></div></div>
                    <div class="topLine topLineForButBig" id="staffAddRemoveUserButtPlaceHolder"><div class="button" id="staffAddRemoveUserButtBackground"></div></div>
                    <div class="topLine topLineForButBig" id="staffAddBanned"><div class="button staffBannedGreen" id="staffAddBannedButton" onclick="staffAddButBanClicked()">Allow</div></div>
                </div>

                <div class="staffPage" id="staffListPage">
                    <div class="topLine topLineForButBig topLinePrevBut" id="staffListPrevButt"><div class="butBackground butBackgroundBigSize" onclick="staffLoupePrevPage()"><img src='./data/arrow_back.png' alt='<' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLineForButBig topLinePrevButPlaceholder" id="staffListPrevButtPlaceHolder"><div class="button prevButtPlaceHolder" id="staffListPrevButtBackground"></div></div>
                    <div class="topLine" id="staffLoupeLoading"> Loading ...</div>
                    <div class="topLine" id="staffLoupeLoadingBackground"><div id="staffLoupeLoadingBackgroundInner"></div></div>
                    <div class="topLine topLineForButBig topLineNextBut" id="staffListNextButt"><div class="butBackground butBackgroundBigSize" onclick="staffLoupeNextPage()"><img src='./data/arrow_forward.png' alt='>' class='imgTopLine butImgBigSize'></div></div>
                    <div class="topLine topLineForButBig topLineNextButPlaceholder" id="staffListNextButtPlaceHolder"><div class="button nextButtPlaceHolder" id="staffListNextButtBackground"></div></div>
                </div>

            </div>
            <!-- -------------------------------------------------------------------------------------- -->
        </div></div>

        <div id="footer"><div class="content textHF" id="footerContent"><div class="textCenter" id="footerText">Rudnev Danil. &emsp; &emsp; Support: https://github.com/RudnevDanil &emsp; &emsp; SFEDU MMCS 2021.</div></div></div>

        <script src="js/jquery-3.5.1.js"></script>
    </body>
</html>

<script src="js/menu.js"></script>
<script src="js/camera.js"></script>
<script src="js/cameraSettings.js"></script>
<script src="js/auth.js"></script>
<script src="js/map.js"></script>
<script src="js/init.js"></script>
<script src="js/staff.js"></script>
<script src="js/faces.js"></script>


<script>
    document.getElementById(ids.menu.auth).style.color = "black";

    // DEBUG set start page
    authFunct.isAuthorized = true; // should be false if not debug
    document.getElementById("staffScreen").style.zIndex = "2"
</script>
