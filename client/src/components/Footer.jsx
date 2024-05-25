import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsFacebook, BsTwitter, BsInstagram, BsGithub, BsDribbble, BsDiscord} from 'react-icons/bs';

export default function FooterCom(){
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div>
                    <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Nipuni's</span>
                            Blog
                     </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                        <Footer.Title title="About"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="https://www.100jsprojects.com"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                100 JS Projects
                            </Footer.Link>
                            <Footer.Link
                                href="/about"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                Nipuni's Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                        <div>
                        <Footer.Title title="Follow Us"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="https://github.com/Kulath1"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                Github
                            </Footer.Link>
                            <Footer.Link
                                href="https://www.linkedin.com/in/nipuni-kulathunga-879898250/"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                LinkedIn
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                        <div>
                        <Footer.Title title="Legal"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="#"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href="#"
                                target='_blank'//open a new tab
                                rel='noopener noreferer' //prevent the blockage of the new tab
                                >
                                Terms &amp; Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider/>
                <div  className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Sahand's Blog" year={new Date().getFullYear()}/>
                    <div className="flex gap-6 sm:mt-3 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook}/>
                        <Footer.Icon href="#" icon={BsTwitter}/>
                        <Footer.Icon href="#" icon={BsInstagram}/>
                        <Footer.Icon href="#" icon={BsGithub}/>
                        <Footer.Icon href="#" icon={BsDribbble}/>
                        <Footer.Icon href="#" icon={BsDiscord}/>
                    </div>
                </div>
            </div>
        </Footer>
    )
}